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

export default class AudioEditor extends AbstractAudioElement {

    private currentContext = new AudioContext();

    private entrypointFilter: AbstractAudioFilterEntrypoint | null = null;
    private filters: AbstractAudioFilter[] = [];
    private renderers: AbstractAudioRenderer[] = [];
    private currentNode: AudioNode | undefined;
    private bufferPlayer: BufferPlayer | undefined;

    principalBuffer: AudioBuffer | null = null;
    renderedBuffer: AudioBuffer | null = null;

    constructor() {
        super();
        this.setupFilters();
        this.setupRenderers();
        this.bufferPlayer = new BufferPlayer(this.currentContext);
        console.log("ok");
    }

    setupFilters() {
        const bassBooster = new BassBoosterFilter(200, 20, 200, 0);
        const bitCrusher = new BitCrusherFilter(4096, 2, 8, 0.15);
        const echo = new EchoFilter(0.2, 0.75);
        const highPass = new HighPassFilter(3500);
        const lowPass = new LowPassFilter(3500);
        const reverb = new ReverbFilter(null); // Todo
        const soundtouchWrapper = new SoundtouchWrapperFilter();
        const limiterFilter = new LimiterFilter(44100, 0, 0, 0, 3, -0.05, 0.05, 4096, 2);
        const telephonizerFilter = new TelephonizerFilter();

        this.filters.push(bassBooster, bitCrusher, echo, highPass, lowPass, reverb, limiterFilter, telephonizerFilter);

        this.entrypointFilter = soundtouchWrapper;
    }

    setupRenderers() {
        const returnAudio = new ReturnAudioRenderer();
        const vocoder = new VocoderRenderer(null); // Todo

        this.renderers.push(returnAudio, vocoder);
    }

    private connectNodes(context: BaseAudioContext, buffer: AudioBuffer) {
        let previousNode: AudioNode | undefined = this.entrypointFilter?.getNode(context, buffer).input;

        for(const filter of this.filters.sort((a, b) => a.getOrder() - b.getOrder())) {
            if(filter.isEnabled()) {
                const node = filter.getNode(context);
                console.log(node, previousNode);
    
                if(previousNode) {
                    previousNode.connect(node.input);
                }
    
                previousNode = node.output;
            }
        }

        this.currentNode = previousNode;
    }

    async renderAudio(): Promise<void> {
        this.currentContext.resume();

        const durationAudio = utils.calcAudioDuration(this.principalBuffer!, 1, false, 1, false);
        const offlineContext = new OfflineAudioContext(2, this.currentContext.sampleRate * durationAudio, this.currentContext.sampleRate);

        let currentBuffer = this.principalBuffer!;

        for(const renderer of this.renderers.sort((a,b ) => a.getOrder() - b.getOrder())) {
            if(renderer.isEnabled()) {
                currentBuffer = await renderer.renderAudio(offlineContext, currentBuffer);
            }
        }

        this.connectNodes(offlineContext, currentBuffer);
            
        const gainNode = offlineContext.createGain();
        gainNode.gain.setValueAtTime(0.001, offlineContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(1.0, offlineContext.currentTime + 0.2);
        
        this.currentNode!.connect(offlineContext.destination);

        this.renderedBuffer = await offlineContext.startRendering();
        //this.bufferPlayer!.setOnPlayingFinished(null);
        this.bufferPlayer!.speedAudio = 1; // TODO
        this.bufferPlayer!.loadBuffer(this.renderedBuffer);

        /*if(!compatModeChecked) {
            const sum = e.renderedBuffer.getChannelData(0).reduce(add, 0);

            if(sum == 0) {
                enableCompaMode();
            }

            compatModeChecked = true;
        }*/
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

    getFiltersState() {
        const state: any = {};

        this.filters.forEach(filter => {
            state[filter.getId()] = filter.isEnabled();
        });

        this.renderers.forEach(filter => {
            state[filter.getId()] = filter.isEnabled();
        });

        return state;
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

    playBuffer() {
        this.bufferPlayer?.start();
    }

    pauseBuffer() {
        this.bufferPlayer?.pause();
    }

    setOnPlayingFinished(func: Function) {
        if(this.bufferPlayer) {
            this.bufferPlayer.setOnPlayingFinished(func);
        }
    }

    setOnPlayerUpdate(func: Function) {
        if(this.bufferPlayer) {
            this.bufferPlayer.setOnUpdate(func);
        }
    }

    getPlayerState() {
        if(this.bufferPlayer) {
            return {
                currentTimeDisplay: this.bufferPlayer.currentTimeDisplay,
                maxTimeDisplay: this.bufferPlayer.maxTimeDisplay,
                percent: this.bufferPlayer?.percent
            };
        }
    }
}