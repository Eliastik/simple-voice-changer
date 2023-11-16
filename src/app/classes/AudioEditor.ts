import AbstractAudioElement from "./model/AbstractAudioElement";
import AbstractAudioFilter from "./model/AbstractAudioFilter";
import AbstractAudioFilterEntrypoint from "./model/AbstractAudioFilterEntrypoint";
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

export default class AudioEditor extends AbstractAudioElement {

    private currentContext: AudioContext | null;
    private configService: ConfigService | null;
    private entrypointFilter: AbstractAudioFilterEntrypoint | null = null;
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

    constructor(context: AudioContext, player: BufferPlayer, eventEmitter: EventEmitter, configService: ConfigService, audioBuffersToFetch: string[]) {
        super();

        this.currentContext = context;
        this.eventEmitter = eventEmitter;
        this.bufferPlayer = player;
        this.configService = configService;
        this.bufferFetcherService = new BufferFetcherService(this.currentContext, this.eventEmitter);

        // Callback called just before starting audio player
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

        this.setupFilters();
        this.setupRenderers();
        this.fetchBuffers(audioBuffersToFetch);

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
        const limiterFilter = new LimiterFilter(44100, 0, 0, 0, 3, -0.05, 0.05, 4096, 2);
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

    /** Fetch default buffers from network */
    fetchBuffers(audioBuffersToFetch: string[]) {
        if (this.downloadingInitialData) {
            return;
        }

        this.downloadingInitialData = true;
        this.eventEmitter?.emit(EventType.LOADING_BUFFERS);

        this.bufferFetcherService?.fetchAllBuffers(audioBuffersToFetch).then(() => {
            this.downloadingInitialData = false;
            this.eventEmitter?.emit(EventType.LOADED_BUFFERS);
        }).catch(e => {
            this.eventEmitter?.emit(EventType.LOADING_BUFFERS_ERROR);
        });
    }

    /** Connect the Audio API nodes of the enabled filters */
    private connectNodes(context: BaseAudioContext, buffer: AudioBuffer, keepCurrentInputOutput: boolean) {
        const entrypointNode = keepCurrentInputOutput && this.currentNodes ? this.currentNodes.input :
            this.entrypointFilter?.getEntrypointNode(context, buffer).input;

        const intermediateNodes: AudioFilterNodes[] = [];
        let previousNode: AudioNode | undefined = entrypointNode;

        this.disconnectOldNodes(keepCurrentInputOutput);

        const filters = this.filters
            .sort((a, b) => a.getOrder() - b.getOrder())
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
    private reconnectNodesIfNeeded() {
        if (this.bufferPlayer?.compatibilityMode && this.currentContext && this.principalBuffer && this.bufferPlayer) {
            this.connectNodes(this.currentContext, this.principalBuffer, true);

            const speedAudio = this.entrypointFilter?.getSpeed()!;
            this.bufferPlayer.speedAudio = speedAudio;
            this.bufferPlayer.duration = this.calculateAudioDuration(speedAudio) * speedAudio;
        }
    }

    /** Render the audio to a buffer */
    async renderAudio(): Promise<void> {
        if (!this.currentContext) {
            console.error("AudioContext is not yet available");
            return;
        }

        this.currentContext.resume();

        const speedAudio = this.entrypointFilter?.getSpeed()!;
        const durationAudio = this.calculateAudioDuration(speedAudio);
        const offlineContext = new OfflineAudioContext(2, this.currentContext.sampleRate * durationAudio, this.currentContext.sampleRate);
        const outputContext = this.isCompatibilityModeEnabled() ? this.currentContext : offlineContext;

        let currentBuffer = this.principalBuffer!;

        for (const renderer of this.renderers.sort((a, b) => a.getOrder() - b.getOrder())) {
            if (renderer.isEnabled()) {
                currentBuffer = await renderer.renderAudio(outputContext, currentBuffer);
            }
        }

        this.renderedBuffer = currentBuffer;

        return await this.setupOutput(outputContext, durationAudio, offlineContext);
    }

    /** Setup output buffers/nodes */
    private async setupOutput(outputContext: BaseAudioContext, durationAudio?: number, offlineContext?: OfflineAudioContext): Promise<void> {
        if (this.renderedBuffer && this.bufferPlayer) {
            this.connectNodes(outputContext, this.renderedBuffer, false);

            const speedAudio = this.entrypointFilter?.getSpeed()!;
            this.bufferPlayer.speedAudio = speedAudio;

            if (!this.isCompatibilityModeEnabled() && offlineContext) {
                this.currentNodes!.output.connect(outputContext.destination);
                this.renderedBuffer = await offlineContext.startRendering();
                this.bufferPlayer.loadBuffer(this.renderedBuffer);

                if (!this.isCompatibilityModeChecked()) {
                    const sum = this.renderedBuffer.getChannelData(0).reduce((a, b) => a + b, 0);

                    this.setCompatibilityModeChecked(true);

                    if (sum == 0) {
                        this.enableCompatibilityMode();
                        this.eventEmitter?.emit(EventType.COMPATIBILITY_MODE_AUTO_ENABLED);
                        return await this.setupOutput(outputContext);
                    }
                }
            } else {
                this.bufferPlayer.setCompatibilityMode(this.currentNodes!.output, durationAudio);
            }
        }
    }

    /** Calculate approximative audio duration according to enabled filters and their settings */
    private calculateAudioDuration(speedAudio: number): number {
        let reverb = false;
        let reverbAddDuration = 1;
        let echo = false;

        for (const filter of this.filters) {
            if (filter.isEnabled()) {
                if (filter.getId() == Constants.FILTERS_NAMES.REVERB) {
                    reverb = true;
                    reverbAddDuration = filter.getSettings().reverbEnvironment.additionalData.addDuration;
                }

                if (filter.getId() == Constants.FILTERS_NAMES.ECHO) {
                    echo = true;
                }
            }
        }

        return utils.calcAudioDuration(this.principalBuffer!, speedAudio, reverb, reverbAddDuration, echo);
    }

    getOrder(): number {
        return -1;
    }

    isEnabled(): boolean {
        return true;
    }

    getId(): string {
        return Constants.AUDIO_EDITOR;
    }

    /** Compatibility mode */
    enableCompatibilityMode() {
        this.setCompatibilityModeEnabled(true);
    }

    disableCompatibilityMode() {
        this.setCompatibilityModeEnabled(false);
    }

    isCompatibilityModeEnabled() {
        if(this.configService) {
            const setting = this.configService.getConfig(Constants.COMPATIBILITY_MODE_ENABLED);
    
            if (setting) {
                return setting == "true";
            }
        }

        return this.compatibilityModeEnabled;
    }

    setCompatibilityModeEnabled(enabled: boolean) {
        this.compatibilityModeEnabled = enabled;

        if (this.configService) {
            this.configService.setConfig(Constants.COMPATIBILITY_MODE_ENABLED, "" + enabled);
        }
    }

    isCompatibilityModeChecked() {
        if(this.configService) {
            const setting = this.configService.getConfig(Constants.COMPATIBILITY_MODE_CHECKED);
    
            if (setting) {
                return setting == "true";
            }
        }

        return this.compatibilityModeChecked;
    }

    setCompatibilityModeChecked(checked: boolean) {
        this.compatibilityModeChecked = checked;

        if (this.configService) {
            this.configService.setConfig(Constants.COMPATIBILITY_MODE_CHECKED, "" + checked);
        }
    }

    /** Filters settings */
    getFiltersState() {
        const state: any = {};

        [...this.filters, ...this.renderers].forEach(filter => {
            state[filter.getId()] = filter.isEnabled();
        });

        return state;
    }

    getFiltersSettings(): Map<string, any> {
        const settings = new Map<string, string[]>();

        for (const filter of this.filters) {
            settings.set(filter.getId(), filter.getSettings());
        }

        return settings;
    }

    toggleFilter(filterId: string) {
        const filter = this.filters.find(f => f.getId() === filterId);
        const renderer = this.renderers.find(f => f.getId() === filterId);

        if (filter) {
            filter.toggle();
        }

        if (renderer) {
            renderer.toggle();
        }

        this.reconnectNodesIfNeeded();
    }

    async changeFilterSettings(filterId: string, settings: any) {
        const filter = this.filters.find(f => f.getId() === filterId);

        if (filter) {
            for (const key of Object.keys(settings)) {
                await filter.setSetting(key, settings[key]);
            }

            this.reconnectNodesIfNeeded();
        }
    }

    resetFilterSettings(filterId: string) {
        const filter = this.filters.find(f => f.getId() === filterId);

        if (filter) {
            filter.resetSettings();
            this.reconnectNodesIfNeeded();
        }
    }

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

    exit() {
        if (this.bufferPlayer) {
            this.bufferPlayer.stop();
            this.bufferPlayer.reset();
            this.principalBuffer = null;
        }
    }

    on(event: string, callback: Function) {
        this.eventEmitter?.on(event, callback);
    }

    /** Save buffer */
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

    downloadAudioBlob(blob: Blob) {
        Recorder.forceDownload(blob, "audio-" + new Date().toISOString() + ".wav");
    }
}