import AbstractAudioElement from "./model/AbstractAudioElement";
import AbstractAudioFilter from "./model/AbstractAudioFilter";
import AudioFilterEntrypointInterface from "./model/AudioFilterEntrypointInterface";
import AbstractAudioRenderer from "./model/AbstractAudioRenderer";
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
import VocoderRenderer from "./filters/VocoderRenderer";
import utils from "./utils/Functions";
import BufferPlayer from "./BufferPlayer";
import BufferFetcherService from "./BufferFetcherService";
import EventEmitter from "./EventEmitter";
import PassThroughFilter from "./filters/PassThroughFilter";
import { EventType } from "./model/EventTypeEnum";
import { ConfigService } from "./model/ConfigService";
import Constants from "./model/Constants";
//@ts-ignore
import { Recorder, getRecorderWorker } from "recorderjs";
import AbstractAudioFilterWorklet from "./model/AbstractAudioFilterWorklet";
import { AudioFilterNodes } from "./model/AudioNodes";

export default class AudioEditor extends AbstractAudioElement {

    private currentContext: AudioContext | null;
    private configService: ConfigService | null;
    private entrypointFilter: (AbstractAudioFilter & AudioFilterEntrypointInterface) | null = null;
    private filters: AbstractAudioFilter[] = [];
    private renderers: AbstractAudioRenderer[] = [];
    private bufferPlayer: BufferPlayer | undefined;
    private eventEmitter: EventEmitter | undefined;
    private renderedBuffer: AudioBuffer | null = null;
    private compatibilityModeEnabled = false;
    private compatibilityModeChecked = false;
    private savingBuffer = false;
    private currentNodes: AudioFilterNodes | null = null;

    principalBuffer: AudioBuffer | null = null;
    downloadingInitialData = false;

    constructor(context: AudioContext, player: BufferPlayer, eventEmitter?: EventEmitter, configService?: ConfigService, audioBuffersToFetch?: string[]) {
        super();

        this.currentContext = context;
        this.eventEmitter = eventEmitter || new EventEmitter();
        this.bufferPlayer = player;
        this.configService = configService || null;
        this.bufferFetcherService = new BufferFetcherService(this.currentContext, this.eventEmitter);

        // Callback called just before starting audio player
        this.setup(audioBuffersToFetch);
    }

    private setup(audioBuffersToFetch: string[] | undefined) {
        if (this.bufferPlayer) {
            this.bufferPlayer.onBeforePlaying(async () => {
                if (this.isCompatibilityModeEnabled() && this.currentContext) {
                    await this.setupOutput(this.currentContext);
                }
            });

            // Callback called when playing is finished
            this.bufferPlayer.on(EventType.PLAYING_FINISHED, () => {
                if (this.bufferPlayer?.loop) {
                    this.bufferPlayer.start();
                }
            });
        }

        this.setupFilters();
        this.setupRenderers();

        if (audioBuffersToFetch) {
            this.fetchBuffers(audioBuffersToFetch);
        }

        for (const filter of this.filters) {
            filter.initializeDefaultSettings();
            filter.bufferFetcherService = this.bufferFetcherService;
        }

        for (const renderer of this.renderers) {
            renderer.bufferFetcherService = this.bufferFetcherService;
        }
    }

    /** Setup all audio filters */
    setupFilters() {
        const bassBooster = new BassBoosterFilter(200, 15, 200, -2);
        const bitCrusher = new BitCrusherFilter(4096, 2, 8, 0.15);
        const echo = new EchoFilter(0.2, 0.75);
        const highPass = new HighPassFilter(3500);
        const lowPass = new LowPassFilter(3500);
        const reverb = new ReverbFilter();
        const soundtouchWrapper = new SoundtouchWrapperFilter();
        const limiterFilter = new LimiterFilter(0, 0, 0, 3, -0.05, 0.05);
        const telephonizerFilter = new TelephonizerFilter();
        const passthroughfilter = new PassThroughFilter();

        this.entrypointFilter = soundtouchWrapper;
        this.filters.push(bassBooster, bitCrusher, echo, highPass, lowPass, reverb, limiterFilter, telephonizerFilter, soundtouchWrapper, passthroughfilter);
    }

    /** Setup the renderers */
    setupRenderers() {
        const returnAudio = new ReturnAudioRenderer();
        const vocoder = new VocoderRenderer();

        this.renderers.push(returnAudio, vocoder);
    }

    /**
     * Fetch default buffers from network
     * @param audioBuffersToFetch List of audio URL to fetch as buffer
     */
    fetchBuffers(audioBuffersToFetch: string[]) {
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

        const filters = this.filters
            .sort((a, b) => a.order - b.order)
            .filter(filter => filter !== this.entrypointFilter && filter.isEnabled());

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
        if (this.bufferPlayer?.compatibilityMode && this.currentContext &&
            this.principalBuffer && this.bufferPlayer && this.entrypointFilter) {
            await this.connectNodes(this.currentContext, this.principalBuffer, true, this.bufferPlayer?.compatibilityMode);

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
     * Render the audio to a buffer
     * @returns A promise resolved when the audio processing is finished
     */
    async renderAudio(): Promise<void> {
        if (!this.currentContext) {
            throw "AudioContext is not yet available";
        }

        if (!this.entrypointFilter) {
            throw "Entrypoint filter is not available";
        }

        this.currentContext.resume();

        const speedAudio = this.entrypointFilter.getSpeed();
        const durationAudio = this.calculateAudioDuration(speedAudio);
        const offlineContext = new OfflineAudioContext(2, this.currentContext.sampleRate * durationAudio, this.currentContext.sampleRate);
        const outputContext = this.isCompatibilityModeEnabled() ? this.currentContext : offlineContext;

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
     * Setup output buffers/nodes
     * @param outputContext Output audio context
     * @param durationAudio Duration of the audio buffer
     * @param offlineContext An offline context to do the rendering (can be omited, in this case the rendering is done in real time - "compatibility mode")
     * @returns A promise resolved when the audio processing is done
     */
    private async setupOutput(outputContext: BaseAudioContext, durationAudio?: number, offlineContext?: OfflineAudioContext): Promise<void> {
        if (this.renderedBuffer && this.bufferPlayer) {
            await this.initializeWorklets(outputContext);
            await this.connectNodes(outputContext, this.renderedBuffer, false, this.isCompatibilityModeEnabled());

            if (this.entrypointFilter) {
                const speedAudio = this.entrypointFilter.getSpeed();
                this.bufferPlayer.speedAudio = speedAudio;
            }

            if (!this.isCompatibilityModeEnabled() && offlineContext && this.currentNodes) {
                this.currentNodes.output.connect(outputContext.destination);

                const renderedBuffer = await offlineContext.startRendering();

                if (!this.isCompatibilityModeChecked()) {
                    const sum = renderedBuffer.getChannelData(0).reduce((a, b) => a + b, 0);

                    if (sum == 0) {
                        this.setCompatibilityModeChecked(true);
                        this.enableCompatibilityMode();
                        this.eventEmitter?.emit(EventType.COMPATIBILITY_MODE_AUTO_ENABLED);
                        return await this.setupOutput(this.currentContext!, durationAudio);
                    }
                }

                this.renderedBuffer = renderedBuffer;
                this.bufferPlayer.loadBuffer(this.renderedBuffer);
            } else {
                this.bufferPlayer.setCompatibilityMode(this.currentNodes!.output, durationAudio);
            }
        }
    }

    /**
     * Calculate approximative audio duration according to enabled filters and their settings
     * @param speedAudio Current audio speed
     * @returns The audio duration
     */
    private calculateAudioDuration(speedAudio: number): number {
        let reverb = false;
        let reverbAddDuration = 1;
        let echo = false;

        for (const filter of this.filters) {
            if (filter.isEnabled()) {
                if (filter.id == Constants.FILTERS_NAMES.REVERB) {
                    reverb = true;
                    reverbAddDuration = filter.getSettings().reverbEnvironment.additionalData.addDuration;
                }

                if (filter.id == Constants.FILTERS_NAMES.ECHO) {
                    echo = true;
                }
            }
        }

        return utils.calcAudioDuration(this.principalBuffer!, speedAudio, reverb, reverbAddDuration, echo);
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

    /** Compatibility mode settings */

    /**
     * Enable the compatibility/direct audio rendering mode
     */
    enableCompatibilityMode() {
        this.setCompatibilityModeEnabled(true);
    }

    /**
     * Disable the compatibility/direct audio rendering mode
     */
    disableCompatibilityMode() {
        this.setCompatibilityModeEnabled(false);
    }

    /**
     * Is the compatibility/direct audio rendering mode enabled?
     *
     * @returns boolean
     */
    isCompatibilityModeEnabled() {
        if (this.configService) {
            return this.configService.getConfig(Constants.COMPATIBILITY_MODE_ENABLED) === "true";
        }

        return this.compatibilityModeEnabled;
    }

    /**
     * Enable/disable compatibility/direct audio rendering mode
     * @param enabled boolean
     */
    setCompatibilityModeEnabled(enabled: boolean) {
        this.compatibilityModeEnabled = enabled;

        if (this.configService) {
            this.configService.setConfig(Constants.COMPATIBILITY_MODE_ENABLED, "" + enabled);
        }
    }

    /**
     * Was compatibility/direct audio rendering mode already checked for auto enabling? (if an error occurs rendering in offline context)
     * @returns boolean
     */
    isCompatibilityModeChecked() {
        if (this.configService) {
            return this.configService.getConfig(Constants.COMPATIBILITY_MODE_CHECKED) === "true";
        }

        return this.compatibilityModeChecked;
    }

    /**
     * Set compatibility/direct audio rendering mode already checked for auto enabling (if an error occurs rendering in offline context)
     * @param checked boolean
     */
    setCompatibilityModeChecked(checked: boolean) {
        this.compatibilityModeChecked = checked;

        if (this.configService) {
            this.configService.setConfig(Constants.COMPATIBILITY_MODE_CHECKED, "" + checked);
        }
    }

    /** Filters settings */

    /**
     * Get enabled/disabled state of all filters/renderers
     * @returns The filters state (enabled/disabled)
     */
    getFiltersState() {
        const state: { [filterId: string]: boolean } = {};

        [...this.filters, ...this.renderers].forEach(filter => {
            state[filter.id] = filter.isEnabled();
        });

        return state;
    }

    /**
     * Get the settings of all filters/renderers
     * @returns 
     */
    getFiltersSettings(): Map<string, any> {
        const settings = new Map<string, any>();

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
    async changeFilterSettings(filterId: string, settings: { [setting: string]: string }) {
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
    on(event: string, callback: Function) {
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
                    worker.onmessage = (e: any) => {
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
                            sampleRate: this.currentContext.sampleRate,
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
