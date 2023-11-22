import AbstractAudioFilterWorklet from "../model/AbstractAudioFilterWorklet";
import Constants from "../model/Constants";

export default class LimiterFilter extends AbstractAudioFilterWorklet {
    private sampleRate = 44100; // Hz
    private preGain = 0; // dB
    private postGain = 0; // dB
    private attackTime = 0; // s
    private releaseTime = 3; // s
    private threshold = -0.05; // dB
    private lookAheadTime = 0.05; // s
    private bufferSize = 4096;
    private channels = 2;

    constructor(sampleRate: number, preGain: number, postGain: number, attackTime: number, releaseTime: number, threshold: number, lookAheadTime: number, bufferSize: number, channels: number) {
        super();
        this.sampleRate = sampleRate || this.sampleRate;
        this.preGain = preGain || this.preGain;
        this.postGain = postGain || this.postGain;
        this.attackTime = attackTime || this.attackTime;
        this.releaseTime = releaseTime || this.releaseTime;
        this.threshold = threshold || this.threshold;
        this.lookAheadTime = lookAheadTime || this.lookAheadTime;
        this.bufferSize = bufferSize || this.bufferSize;
        this.channels = channels || this.channels;
        this.enable();
        this.setDefaultEnabled(true);
    }

    async initializeWorklet(audioContext: BaseAudioContext): Promise<void> {
        await audioContext.audioWorklet.addModule(Constants.WORKLET_PATHS.LIMITER);
    }

    getNode(context: BaseAudioContext): AudioFilterNodes {
        /*if(this.currentWorkletNode && context == this.currentWorkletNode.context) {
            this.currentWorkletNode.onaudioprocess = null;
        } else {*/
            this.currentWorkletNode = new AudioWorkletNode(context, "limiter-processor");
            //this.reset();
        //}

        this.applyCurrentSettingsToWorklet();

        return {
            input: this.currentWorkletNode,
            output: this.currentWorkletNode
        };
    }

    // TODO on worklet
    /*reset() {
        for (let i = 0; i < this.delayBuffer.length; i++) {
            if (this.delayBuffer[i] != null) {
                this.delayBuffer[i].reset();
            }
        }

        this.envelopeSample = 0;
    }*/

    getOrder(): number {
        return 10;
    }

    getId(): string {
        return Constants.FILTERS_NAMES.LIMITER;
    }

    getSettings() {
        return {
            preGain: this.preGain,
            postGain: this.postGain,
            attackTime: this.attackTime,
            releaseTime: this.releaseTime,
            threshold: this.threshold,
            lookAheadTime: this.lookAheadTime,
        };
    }

    async setSetting(settingId: string, value: string) {
        if(!value || value == "" || isNaN(Number(value))) {
            return;
        }
        
        switch (settingId) {
            case "preGain":
                this.preGain = parseFloat(value);
                break;
            case "postGain":
                this.postGain = parseFloat(value);
                break;
            case "attackTime":
                this.attackTime = parseFloat(value);
                break;
            case "releaseTime":
                this.releaseTime = parseFloat(value);
                break;
            case "threshold":
                this.threshold = parseFloat(value);
                break;
            case "lookAheadTime":
                this.lookAheadTime = parseFloat(value);
                break;
        }

        this.applyCurrentSettingsToWorklet();
    }
}