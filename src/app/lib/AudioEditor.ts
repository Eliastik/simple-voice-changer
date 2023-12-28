import AbstractAudioElement from "./filters/interfaces/AbstractAudioElement";
import AbstractAudioFilter from "./filters/interfaces/AbstractAudioFilter";
import AudioFilterEntrypointInterface from "./filters/interfaces/AudioFilterEntrypointInterface";
import AbstractAudioRenderer from "./filters/interfaces/AbstractAudioRenderer";
import BassBoosterFilter from "./filters/BassBoosterFilter";
import BitCrusherFilter from "./filters/BitCrusherFilter";
import EchoFilter from "./filters/EchoFilter";
import HighPassFilter from "./filters/HighPassFilter";
import LimiterFilter from "./filters/LimiterFilter";
import LowPassFilter from "./filters/LowPassFilter";
import ReturnAudioRenderer from "./filters/ReturnAudioRenderer";
import ReverbFilter from "./filters/ReverbFilter";
import SoundtouchWrapperFilter from "./filters/SountouchWrapperFilter";
import TelephonizerFilter from "./filters/TelephonizerFilter";
import utils from "./utils/Functions";
import BufferPlayer from "./BufferPlayer";
import BufferFetcherService from "./services/BufferFetcherService";
import EventEmitter from "./utils/EventEmitter";
import PassThroughFilter from "./filters/PassThroughFilter";
import { EventType } from "./model/EventTypeEnum";
import Constants from "./model/Constants";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import { Recorder, getRecorderWorker } from "recorderjs";
import AbstractAudioFilterWorklet from "./filters/interfaces/AbstractAudioFilterWorklet";
import { AudioFilterNodes } from "./model/AudioNodes";
import VocoderFilter from "./filters/VocoderFilter";
import { ConfigService } from "./services/ConfigService";
import utilFunctions from "./utils/Functions";
import { FilterSettings } from "./model/filtersSettings/FilterSettings";
import RecorderWorkerMessage from "./model/RecorderWorkerMessage";
import { EventEmitterCallback } from "./model/EventEmitterCallback";
import { FilterState } from "./model/FilterState";
import GenericConfigService from "./utils/GenericConfigService";

export default class AudioEditor extends AbstractAudioElement {

    /** The current audio context */
    private currentContext: AudioContext | null | undefined;
    /** The audio buffer to be processed */
    private principalBuffer: AudioBuffer | null = null;
    /** The resulting audio buffer */
    private renderedBuffer: AudioBuffer | null = null;
    /** The entrypoint filter */
    private entrypointFilter: (AbstractAudioFilter & AudioFilterEntrypointInterface) | null = null;
    /** A list of filters */
    private filters: AbstractAudioFilter[] = [];
    /** A list of renderers */
    private renderers: AbstractAudioRenderer[] = [];
    /** The audio player */
    private bufferPlayer: BufferPlayer | undefined;
    /** The event emitter */
    private eventEmitter: EventEmitter | undefined;
    /** The current connected nodes */
    private currentNodes: AudioFilterNodes | null = null;

    /** If we are currently processing and downloading the buffer */
    private savingBuffer = false;
    /** The previous sample rate setting */
    private previousSampleRate = Constants.DEFAULT_SAMPLE_RATE;

    /** True if we are downloading initial buffer data */
    downloadingInitialData = false;

    constructor(context?: AudioContext | null, player?: BufferPlayer, eventEmitter?: EventEmitter, configService?: ConfigService, audioBuffersToFetch?: string[]) {
        super();
        
        this.currentContext = context;
        this.eventEmitter = eventEmitter || new EventEmitter();
        this.bufferPlayer = player || new BufferPlayer(context!);
        this.configService = configService || new GenericConfigService();
        this.bufferFetcherService = new BufferFetcherService(this.currentContext!, this.eventEmitter);

        // Callback called just before starting audio player
        this.setup(audioBuffersToFetch);
    }

    private setup(audioBuffersToFetch: string[] | undefined) {
        if (this.configService) {
            this.previousSampleRate = this.configService.getSampleRate();
            this.eventEmitter?.emit(EventType.SAMPLE_RATE_CHANGED, this.previousSampleRate);
        }

        if(!this.currentContext) {
            this.createNewContext(this.previousSampleRate);
        }

        if (this.bufferPlayer) {
            // Callback called just before starting playing audio, when compatibility mode is enabled
            this.bufferPlayer.onBeforePlaying(async () => {
                if (this.bufferPlayer && this.bufferPlayer.compatibilityMode && this.currentContext) {
                    await this.setupOutput(this.currentContext);
                }
            });

            // Callback called when playing is finished
            this.bufferPlayer.on(EventType.PLAYING_FINISHED, () => {
                if (this.bufferPlayer && this.bufferPlayer.loop) {
                    this.bufferPlayer.start();
                }
            });
        }

        this.setupDefaultFilters();
        this.setupDefaultRenderers();

        if (audioBuffersToFetch) {
            this.fetchBuffers(audioBuffersToFetch);
        }
    }

    /**
     * Add a new custom filter for this audio editor
     * @param filters One or more AbstractAudioFilter
     */
    addFilters(...filters: AbstractAudioFilter[]) {
        for (const filter of filters) {
            filter.initializeDefaultSettings();
            filter.bufferFetcherService = this.bufferFetcherService;
            filter.configService = this.configService;
        }

        this.filters.push(...filters);
    }

    /**
     * Add a new custom renderer for this audio editor
     * @param renderers One or more AbstractAudioRenderer
     */
    addRenderers(...renderers: AbstractAudioRenderer[]) {
        for (const renderer of renderers) {
            renderer.bufferFetcherService = this.bufferFetcherService;
            renderer.configService = this.configService;
        }

        this.renderers.push(...renderers);
    }

    /** Setup all audio filters */
    private setupDefaultFilters() {
        const bassBooster = new BassBoosterFilter(200, 15, 200, -2);
        const bitCrusher = new BitCrusherFilter(2, 8, 0.15);
        const echo = new EchoFilter(0.2, 0.75);
        const highPass = new HighPassFilter(3500);
        const lowPass = new LowPassFilter(3500);
        const reverb = new ReverbFilter();
        const soundtouchWrapper = new SoundtouchWrapperFilter();
        const limiterFilter = new LimiterFilter(0, 0, 0, 3, -0.05, 0.1);
        const telephonizerFilter = new TelephonizerFilter();
        const vocoder = new VocoderFilter();

        this.entrypointFilter = soundtouchWrapper;
        this.addFilters(bassBooster, bitCrusher, echo, highPass, lowPass, reverb, limiterFilter, telephonizerFilter, soundtouchWrapper, vocoder);
    }

    /** Setup the renderers */
    private setupDefaultRenderers() {
        const returnAudio = new ReturnAudioRenderer();
        this.addRenderers(returnAudio);
    }

    /**
     * Fetch default buffers from network
     * @param audioBuffersToFetch List of audio URL to fetch as buffer
     */
    private fetchBuffers(audioBuffersToFetch: string[]) {
        if (this.downloadingInitialData) {
            return;
        }

        this.downloadingInitialData = true;
        this.eventEmitter?.emit(EventType.LOADING_BUFFERS);

        this.bufferFetcherService?.fetchAllBuffers(audioBuffersToFetch).then(() => {
            this.downloadingInitialData = false;
            this.eventEmitter?.emit(EventType.LOADED_BUFFERS);
        }).catch(() => {
            this.eventEmitter?.emit(EventType.LOADING_BUFFERS_ERROR);
        });
    }

    /**
     * Create new context if needed, for example if sample rate setting have changed
     */
    private async createNewContextIfNeeded() {
        const isCompatibilityModeEnabled = this.configService && this.configService.isCompatibilityModeEnabled();

        if(isCompatibilityModeEnabled && this.principalBuffer) {
            // If compatibility mode is enabled, we use the sample rate of the input audio buffer
            if(this.currentSampleRate != this.principalBuffer.sampleRate) {
                await this.createNewContext(this.principalBuffer.sampleRate);
                this.previousSampleRate = this.principalBuffer.sampleRate;
            }
        } else {
            // Otherwise we change the context if the sample rate has changed
            let currentSampleRate = Constants.DEFAULT_SAMPLE_RATE;
    
            if (this.configService) {
                currentSampleRate = this.configService.getSampleRate();
            }
    
            // If sample rate setting has changed, create a new audio context
            if (currentSampleRate != this.previousSampleRate) {
                await this.createNewContext(currentSampleRate);
                this.previousSampleRate = currentSampleRate;
            }
        }
    }

    /** 
     * Stop previous audio context and create a new one
     */
    private async createNewContext(sampleRate: number) {
        if (this.currentContext) {
            await this.currentContext.close();
        }

        const options: AudioContextOptions = {
            latencyHint: "interactive"
        };

        if (sampleRate != 0) {
            options.sampleRate = sampleRate;
        }

        this.currentContext = new AudioContext(options);
        this.eventEmitter?.emit(EventType.SAMPLE_RATE_CHANGED, this.currentContext.sampleRate);

        if (this.bufferPlayer) {
            this.bufferPlayer.updateContext(this.currentContext);
        }

        if(this.bufferFetcherService) {
            this.bufferFetcherService.updateContext(this.currentContext);
        }
    }

    /** Prepare the AudioContext before use */
    private async prepareContext() {
        await this.createNewContextIfNeeded();

        if (this.currentContext) {
            this.currentContext.resume();
        }
    }

    /**
     * Get the current sample rate used
     */
    get currentSampleRate(): number {
        if(this.currentContext) {
            return this.currentContext.sampleRate;
        }

        return 0;
    }

    /**
     * Get the default device sample rate
     */
    get defaultDeviceSampleRate(): number {
        const tempContext = new AudioContext();
        let sampleRate = 0;

        if(tempContext) {
            sampleRate = tempContext.sampleRate;
            tempContext.close();
        }

        return sampleRate;
    }

    /** Decode and load an audio buffer from an audio file */
    async loadBufferFromFile(file: File) {
        this.principalBuffer = null;
        
        await this.prepareContext();

        if (this.currentContext) {
            this.principalBuffer = await utilFunctions.loadAudioBuffer(this.currentContext, file);
        } else {
            throw new Error("Audio Context is not ready!");
        }
    }

    /** Change the principal audio buffer of this editor */
    loadBuffer(audioBuffer: AudioBuffer) {
        this.principalBuffer = audioBuffer;
    }

    /**
     * Connect the Audio API nodes of the enabled filters
     * @param context The Audio Context
     * @param buffer  The Audio Buffer
     * @param keepCurrentInputOutput Keep current first input/output nodes?
     */
    private async connectNodes(context: BaseAudioContext, buffer: AudioBuffer, keepCurrentInputOutput: boolean, isCompatibilityMode: boolean) {
        if (!this.entrypointFilter) {
            return;
        }

        let entrypointNode: AudioNode | null = null;

        if (keepCurrentInputOutput && this.currentNodes) {
            entrypointNode = this.currentNodes.input;
        } else {
            const entrypointNodes = await this.entrypointFilter.getEntrypointNode(context, buffer, !isCompatibilityMode);
            entrypointNode = entrypointNodes.input;
        }

        const intermediateNodes: AudioFilterNodes[] = [];
        let previousNode: AudioNode | undefined = entrypointNode;

        this.disconnectOldNodes(keepCurrentInputOutput);

        // Sort by filter order, then remove the disabled filter (but always keep the last/output filter)
        const filters = this.filters
            .sort((a, b) => a.order - b.order)
            .filter((filter, index) => filter !== this.entrypointFilter && (filter.isEnabled() || index >= this.filters.length - 1));

        for (const filter of filters) {
            const node = filter.getNode(context);

            if (previousNode) {
                previousNode.connect(node.input);
            }

            previousNode = node.output;
            intermediateNodes.push(node);
        }

        if (this.entrypointFilter) {
            this.entrypointFilter.updateState();
        }

        this.currentNodes = {
            input: entrypointNode!,
            output: previousNode!,
            intermediateNodes: intermediateNodes
                .filter(n => n.input != previousNode && n.output != previousNode &&
                    n.input != entrypointNode && n.output != entrypointNode)
        };
    }

    /**
     * Disconnect old audio nodes
     * @param keepCurrentOutput Keeps current output nodes?
     */
    private disconnectOldNodes(keepCurrentOutput: boolean) {
        if (this.currentNodes) {
            this.currentNodes.input.disconnect();

            if (!keepCurrentOutput) {
                this.currentNodes.output.disconnect();
            }

            if (this.currentNodes.intermediateNodes) {
                for (const intermediate of this.currentNodes.intermediateNodes) {
                    intermediate.input.disconnect();
                    intermediate.output.disconnect();
                }
            }
        }
    }

    /** Reconnect the nodes if the compatibility/direct mode is enabled */
    private async reconnectNodesIfNeeded() {
        if (this.bufferPlayer && this.bufferPlayer.compatibilityMode &&
            this.currentContext && this.principalBuffer &&
            this.bufferPlayer && this.entrypointFilter) {
            await this.connectNodes(this.currentContext, this.principalBuffer, true, this.bufferPlayer.compatibilityMode);

            const speedAudio = this.entrypointFilter.getSpeed();
            this.bufferPlayer.speedAudio = speedAudio;
            this.bufferPlayer.duration = this.calculateAudioDuration(speedAudio) * speedAudio;
        }
    }

    /** Initialize worklets filters */
    private async initializeWorklets(context: BaseAudioContext) {
        for (const filter of this.filters) {
            if (filter.isWorklet()) {
                await (filter as AbstractAudioFilterWorklet).initializeWorklet(context);
            }
        }
    }

    /**
     * Get the rendered audio buffer
     * @returns The AudioBuffer
     */
    getOutputBuffer() {
        return this.renderedBuffer;
    }

    /**
     * Render the audio to a buffer
     * @returns A promise resolved when the audio processing is finished.
     * The resulting audio buffer can then be obtained by using the "getOutputBuffer" method.
     */
    async renderAudio(): Promise<void> {
        await this.prepareContext();

        if (!this.currentContext) {
            throw new Error("AudioContext is not yet available");
        }

        if (!this.entrypointFilter) {
            throw new Error("Entrypoint filter is not available");
        }

        const speedAudio = this.entrypointFilter.getSpeed();
        const durationAudio = this.calculateAudioDuration(speedAudio);
        const offlineContext = new OfflineAudioContext(2, this.currentContext.sampleRate * durationAudio, this.currentContext.sampleRate);
        const outputContext = this.configService && this.configService.isCompatibilityModeEnabled() ? this.currentContext : offlineContext;

        let currentBuffer = this.principalBuffer!;

        for (const renderer of this.renderers.sort((a, b) => a.order - b.order)) {
            if (renderer.isEnabled()) {
                currentBuffer = await renderer.renderAudio(outputContext, currentBuffer);
            }
        }

        this.renderedBuffer = currentBuffer;

        return await this.setupOutput(outputContext, durationAudio, offlineContext);
    }

    /**
     * Setup output buffers/nodes, then process the audio
     * @param outputContext Output audio context
     * @param durationAudio Duration of the audio buffer
     * @param offlineContext An offline context to do the rendering (can be omited, in this case the rendering is done in real time - "compatibility mode")
     * @returns A promise resolved when the audio processing is done
     */
    private async setupOutput(outputContext: BaseAudioContext, durationAudio?: number, offlineContext?: OfflineAudioContext): Promise<void> {
        if (this.renderedBuffer && this.configService) {
            await this.initializeWorklets(outputContext);
            await this.connectNodes(outputContext, this.renderedBuffer, false, this.configService.isCompatibilityModeEnabled());

            if (this.entrypointFilter && this.bufferPlayer) {
                const speedAudio = this.entrypointFilter.getSpeed();
                this.bufferPlayer.speedAudio = speedAudio;
            }

            if (!this.configService.isCompatibilityModeEnabled() && offlineContext && this.currentNodes) {
                this.currentNodes.output.connect(outputContext.destination);

                const renderedBuffer = await offlineContext.startRendering();

                if (!this.configService.isCompatibilityModeChecked()) {
                    const sum = renderedBuffer.getChannelData(0).reduce((a, b) => a + b, 0);

                    if (sum == 0) {
                        this.setCompatibilityModeChecked(true);
                        this.configService.enableCompatibilityMode();
                        this.eventEmitter?.emit(EventType.COMPATIBILITY_MODE_AUTO_ENABLED);
                        return await this.setupOutput(this.currentContext!, durationAudio);
                    }
                }

                this.renderedBuffer = renderedBuffer;

                if(this.bufferPlayer) {
                    this.bufferPlayer.loadBuffer(this.renderedBuffer);
                }
            } else {
                if(this.bufferPlayer) {
                    this.bufferPlayer.setCompatibilityMode(this.currentNodes!.output, durationAudio);
                }
            }
        }
    }

    /**
     * Calculate approximative audio duration according to enabled filters and their settings
     * @param speedAudio Current audio speed
     * @returns The audio duration
     */
    private calculateAudioDuration(speedAudio: number): number {
        if (this.principalBuffer) {
            let duration = utils.calcAudioDuration(this.principalBuffer, speedAudio);

            for (const filter of this.filters) {
                if (filter.isEnabled()) {
                    duration += filter.getAddingTime();
                }
            }

            return duration;
        }

        return 0;
    }

    get order(): number {
        return -1;
    }

    get id(): string {
        return Constants.AUDIO_EDITOR;
    }

    isEnabled(): boolean {
        return true;
    }

    /**
     * Set compatibility/direct audio rendering mode already checked for auto enabling (if an error occurs rendering in offline context)
     * @param checked boolean
     */
    private setCompatibilityModeChecked(checked: boolean) {
        if(this.configService) {
            this.configService.setConfig(Constants.PREFERENCES_KEYS.COMPATIBILITY_MODE_CHECKED, "" + checked);
        }
    }

    /** Filters settings */

    /**
     * Get enabled/disabled state of all filters/renderers
     * @returns The filters state (enabled/disabled)
     */
    getFiltersState(): FilterState {
        const state: FilterState = {};

        [...this.filters, ...this.renderers].forEach(filter => {
            state[filter.id] = filter.isEnabled();
        });

        return state;
    }

    /**
     * Get the settings of all filters/renderers
     * @returns 
     */
    getFiltersSettings(): Map<string, FilterSettings> {
        const settings = new Map<string, FilterSettings>();

        for (const filter of this.filters) {
            settings.set(filter.id, filter.getSettings());
        }

        return settings;
    }

    /**
     * Toggle enabled/disabled state for a filter/renderer
     * @param filterId The filter/renderer ID
     */
    toggleFilter(filterId: string) {
        const filter = this.filters.find(f => f.id === filterId);
        const renderer = this.renderers.find(f => f.id === filterId);

        if (filter) {
            filter.toggle();
        }

        if (renderer) {
            renderer.toggle();
        }

        this.reconnectNodesIfNeeded();
    }

    /**
     * Change a filter/renderer setting
     * @param filterId Filter ID
     * @param settings Filter setting (key/value)
     */
    async changeFilterSettings(filterId: string, settings: FilterSettings) {
        const filter = this.filters.find(f => f.id === filterId);

        if (filter) {
            for (const key of Object.keys(settings)) {
                await filter.setSetting(key, settings[key]);
            }

            await this.reconnectNodesIfNeeded();
        }
    }

    /**
     * Reset the settings of a filter/renderer
     * @param filterId Id of the filter/renderer
     */
    resetFilterSettings(filterId: string) {
        const filter = this.filters.find(f => f.id === filterId);

        if (filter) {
            filter.resetSettings();
            this.reconnectNodesIfNeeded();
        }
    }

    /**
     * Reset all filters/renderers state (enabled/disabled) based on their default states
     */
    resetAllFiltersState() {
        [...this.filters, ...this.renderers].forEach(element => {
            if (element.isDefaultEnabled()) {
                element.enable();
            } else {
                element.disable();
            }
        });

        this.reconnectNodesIfNeeded();
    }

    /** Events and exit */

    /**
     * Exit/reset the audio editor basic state
     */
    exit() {
        if (this.bufferPlayer) {
            this.bufferPlayer.stop();
            this.bufferPlayer.reset();
            this.principalBuffer = null;
        }
    }

    /**
     * Subscribe to an event
     * @param event The event ID
     * @param callback The callback function
     */
    on(event: string, callback: EventEmitterCallback) {
        this.eventEmitter?.on(event, callback);
    }

    /**
     * Save the rendered audio to a buffer
     * @returns A promise resolved when the audio buffer is downloaded to the user
     */
    saveBuffer(): Promise<boolean> {
        if (this.savingBuffer) {
            return Promise.reject();
        }

        this.savingBuffer = true;

        return new Promise(resolve => {
            if (!this.bufferPlayer?.compatibilityMode) {
                if (!this.renderedBuffer || !this.currentContext) {
                    return resolve(false);
                }

                const worker = getRecorderWorker.default();

                if (worker) {
                    worker.onmessage = (e: RecorderWorkerMessage) => {
                        if (e.data.command == Constants.EXPORT_WAV_COMMAND) {
                            this.downloadAudioBlob(e.data.data);
                        }

                        worker.terminate();
                        this.savingBuffer = false;
                        resolve(true);
                    };

                    worker.postMessage({
                        command: Constants.INIT_COMMAND,
                        config: {
                            sampleRate: this.renderedBuffer.sampleRate,
                            numChannels: 2
                        }
                    });

                    const buffer: Float32Array[] = [];

                    for (let i = 0; i < this.renderedBuffer.numberOfChannels; i++) {
                        buffer.push(this.renderedBuffer.getChannelData(i));
                    }

                    worker.postMessage({
                        command: Constants.RECORD_COMMAND,
                        buffer
                    });

                    worker.postMessage({
                        command: Constants.EXPORT_WAV_COMMAND,
                        type: Constants.AUDIO_WAV
                    });
                }
            } else {
                this.bufferPlayer?.start().then(() => {
                    const rec = new Recorder(this.currentNodes!.output);
                    rec.record();

                    const finishedCallback = () => {
                        rec.stop();

                        rec.exportWAV((blob: Blob) => {
                            this.downloadAudioBlob(blob);

                            this.savingBuffer = false;
                            this.eventEmitter?.off(EventType.PLAYING_FINISHED, finishedCallback);

                            resolve(true);
                        });
                    };

                    this.eventEmitter?.on(EventType.PLAYING_FINISHED, finishedCallback);

                    const playingStoppedCallback = () => {
                        rec.stop();

                        this.savingBuffer = false;
                        this.eventEmitter?.off(EventType.PLAYING_STOPPED, playingStoppedCallback);

                        resolve(true);
                    };

                    this.eventEmitter?.on(EventType.PLAYING_STOPPED, playingStoppedCallback);
                });
            }
        });
    }

    /**
     * Download an audio Blob
     * @param blob The blob
     */
    private downloadAudioBlob(blob: Blob) {
        Recorder.forceDownload(blob, "audio-" + new Date().toISOString() + ".wav");
    }
}
