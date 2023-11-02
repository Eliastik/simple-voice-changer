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
//@ts-ignore
import { Recorder, getRecorderWorker } from "recorderjs";

export default class AudioEditor extends AbstractAudioElement {

    private currentContext: AudioContext | null;
    private entrypointFilter: AbstractAudioFilterEntrypoint | null = null;
    private filters: AbstractAudioFilter[] = [];
    private renderers: AbstractAudioRenderer[] = [];
    private currentNode: AudioNode | undefined;
    private bufferPlayer: BufferPlayer | undefined;
    private eventEmitter: EventEmitter | undefined;
    private renderedBuffer: AudioBuffer | null = null;
    private compatibilityModeEnabled = false;
    private compatibilityModeChecked = false;

    principalBuffer: AudioBuffer | null = null;
    downloadingInitialData = false;

    constructor(context: AudioContext) {
        super();

        this.currentContext = context;
        this.eventEmitter = new EventEmitter();
        this.bufferPlayer = new BufferPlayer(this.currentContext, this.eventEmitter);
        this.bufferFetcherService = new BufferFetcherService(this.currentContext, this.eventEmitter);

        this.setupFilters();
        this.setupRenderers();
        this.fetchBuffers();

        for(const filter of this.filters) {
            filter.initializeDefaultSettings();
            filter.bufferFetcherService = this.bufferFetcherService;
        }

        for(const renderer of this.renderers) {
            renderer.bufferFetcherService = this.bufferFetcherService;
        }
    }

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

        this.entrypointFilter = soundtouchWrapper;
        this.filters.push(bassBooster, bitCrusher, echo, highPass, lowPass, reverb, limiterFilter, telephonizerFilter, soundtouchWrapper);
    }

    setupRenderers() {
        const returnAudio = new ReturnAudioRenderer();
        const vocoder = new VocoderRenderer();

        this.renderers.push(returnAudio, vocoder);
    }

    fetchBuffers() {
        if(this.downloadingInitialData) {
            return;
        }

        this.downloadingInitialData = true;
        this.eventEmitter?.emit("loadingBuffers");
        
        this.bufferFetcherService?.fetchAllBuffers(["static/sounds/impulse_response.wav","static/sounds/modulator.mp3"]).then(() => {
            this.downloadingInitialData = false;
            this.eventEmitter?.emit("loadedBuffers");
        });
    }

    private connectNodes(context: BaseAudioContext, buffer: AudioBuffer) {
        let previousNode: AudioNode | undefined = this.entrypointFilter?.getEntrypointNode(context, buffer).input;

        for(const filter of this.filters.sort((a, b) => a.getOrder() - b.getOrder())) {
            if(filter == this.entrypointFilter) {
                continue;
            }

            if(filter.isEnabled()) {
                const node = filter.getNode(context);
    
                if(previousNode) {
                    previousNode.connect(node.input);
                }
    
                previousNode = node.output;
            }
        }

        this.currentNode = previousNode;
    }

    async renderAudio(): Promise<void> {
        if(!this.currentContext) {
            console.error("AudioContext is not yet available");
            return;
        }

        this.currentContext.resume();

        const speedAudio = this.entrypointFilter?.getSpeed()!;
        const durationAudio = this.calculateAudioDuration(speedAudio);
        const offlineContext = new OfflineAudioContext(2, this.currentContext.sampleRate * durationAudio, this.currentContext.sampleRate);
        const outputContext = this.compatibilityModeEnabled ? this.currentContext : offlineContext;

        let currentBuffer = this.principalBuffer!;

        for(const renderer of this.renderers.sort((a,b ) => a.getOrder() - b.getOrder())) {
            if(renderer.isEnabled()) {
                currentBuffer = await renderer.renderAudio(outputContext, currentBuffer);
            }
        }

        this.connectNodes(outputContext, currentBuffer);
        
        const gainNode = outputContext.createGain();
        gainNode.gain.setValueAtTime(0.001, outputContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(1.0, outputContext.currentTime + 0.2);

        if(!this.compatibilityModeEnabled) {
            this.currentNode!.connect(outputContext.destination);
            this.renderedBuffer = await offlineContext.startRendering();
            this.bufferPlayer!.speedAudio = speedAudio;
            this.bufferPlayer!.loadBuffer(this.renderedBuffer);
            
            if(!this.compatibilityModeChecked) {
                const sum = this.renderedBuffer.getChannelData(0).reduce((a, b) => a + b, 0);
    
                if(sum == 0) {
                    this.compatibilityModeEnabled = true;
                }
    
                this.compatibilityModeChecked = true;
            }
        }

        if(this.compatibilityModeEnabled) {
            this.bufferPlayer?.setCompatibilityMode(durationAudio, outputContext, this.currentNode!);
        }
    }

    private calculateAudioDuration(speedAudio: number): number {
        let reverb = false;
        let reverbAddDuration = 1;
        let echo = false;

        for(const filter of this.filters) {
            if(filter.isEnabled()) {
                if(filter.getId() == "reverb") {
                    reverb = true;
                    reverbAddDuration = filter.getSettings().reverbEnvironment.additionalData.addDuration;
                }

                if(filter.getId() == "echo") {
                    echo = true;
                }
            }
        }

        return utils.calcAudioDuration(this.principalBuffer!, speedAudio, reverb, reverbAddDuration, echo);
    }

    enableCompatibilityMode() {
        this.compatibilityModeEnabled = true;
    }

    disableCompatibilityMode() {
        this.compatibilityModeEnabled = false;
    }

    getOrder(): number {
        return -1;
    }

    isEnabled(): boolean {
        return true;
    }

    getId(): string {
        return "audioEditor";
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

        for(const filter of this.filters) {
            settings.set(filter.getId(), filter.getSettings());
        }

        return settings;
    }

    toggleFilter(filterId: string) {
        const filter = this.filters.find(f => f.getId() === filterId);
        const renderer = this.renderers.find(f => f.getId() === filterId);

        if(filter) {
            filter.toggle();
        }

        if(renderer) {
            renderer.toggle();
        }
    }

    changeFilterSettings(filterId: string, settings: any) {
        const filter = this.filters.find(f => f.getId() === filterId);

        if(filter) {
            Object.keys(settings).forEach(key => {
                filter.setSetting(key, settings[key]);
            });
        }
    }

    resetFilterSettings(filterId: string) {
        const filter = this.filters.find(f => f.getId() === filterId);

        if(filter) {
            filter.resetSettings();
        }
    }

    resetAllFiltersState() {
        [...this.filters, ...this.renderers].forEach(element => {
            if(element.isDefaultEnabled()) {
                element.enable();
            } else {
                element.disable();
            }
        });
    }

    /** Audio Player */
    playBuffer() {
        if(this.bufferPlayer) {
            this.bufferPlayer?.start();
        }
    }

    pauseBuffer() {
        if(this.bufferPlayer) {
            this.bufferPlayer?.pause();
        }
    }

    toggleLoopPlayer() {
        if(this.bufferPlayer) {
            this.bufferPlayer.loop = !this.bufferPlayer.loop;
        }
    }

    setPlayerTime(percent: number) {
        if(this.bufferPlayer) {
            this.bufferPlayer.setTime(percent);
        }
    }

    getPlayerState() {
        if(this.bufferPlayer) {
            return {
                currentTimeDisplay: this.bufferPlayer.currentTimeDisplay,
                maxTimeDisplay: this.bufferPlayer.maxTimeDisplay,
                percent: this.bufferPlayer.percent,
                loop: this.bufferPlayer.loop,
                currentTime: this.bufferPlayer.currentTime,
                maxTime: this.bufferPlayer.duration
            };
        }
    }

    exit() {
        if(this.bufferPlayer) {
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
        return new Promise(resolve => {
            if(!this.renderedBuffer || !this.currentContext) {
                return resolve(false);
            }
            
            const worker = getRecorderWorker.default();
        
            if(worker) {
                worker.onmessage = (e: any) => {
                    if(e.data.command == 'exportWAV') {
                        this.downloadAudioBlob(e.data.data);
                    }
        
                    worker.terminate();
                    resolve(true);
                };
        
                worker.postMessage({
                    command: "init",
                    config: {
                        sampleRate: this.currentContext.sampleRate,
                        numChannels: 2
                    }
                });
        
                worker.postMessage({
                    command: "record",
        
                    buffer: [
                        this.renderedBuffer.getChannelData(0),
                        this.renderedBuffer.getChannelData(1)
                    ]
                });
        
                worker.postMessage({
                    command: "exportWAV",
                    type: "audio/wav"
                });
            }
        });
    }

    downloadAudioBlob(blob: Blob) {
        Recorder.forceDownload(blob, "audio-" + new Date().toISOString() + ".wav");
    }
}