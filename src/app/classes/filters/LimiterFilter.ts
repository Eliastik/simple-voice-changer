import AbstractAudioFilterWorklet from "../model/AbstractAudioFilterWorklet";
import Constants from "../model/Constants";
import worklets from "./worklets";

export default class LimiterFilter extends AbstractAudioFilterWorklet {
    private preGain = 0; // dB
    private postGain = 0; // dB
    private attackTime = 0; // s
    private releaseTime = 3; // s
    private threshold = -0.05; // dB
    private lookAheadTime = 0.1; // s

    constructor(preGain: number, postGain: number, attackTime: number, releaseTime: number, threshold: number, lookAheadTime: number) {
        super();
        this.preGain = preGain || this.preGain;
        this.postGain = postGain || this.postGain;
        this.attackTime = attackTime || this.attackTime;
        this.releaseTime = releaseTime || this.releaseTime;
        this.threshold = threshold || this.threshold;
        this.lookAheadTime = lookAheadTime || this.lookAheadTime;
        this.enable();
        this.setDefaultEnabled(true);
    }

    get workletPath(): string {
        return Constants.WORKLET_PATHS.LIMITER;
    }
    
    get workletName(): string {
        return Constants.WORKLET_NAMES.LIMITER;
    }

    get order(): number {
        return 10;
    }

    get id(): string {
        return Constants.FILTERS_NAMES.LIMITER;
    }

    constructAudioWorkletProcessor(): any {
        return new worklets.LimiterProcessor();
    }

    getAddingTime() {
        return this.lookAheadTime;
    }

    getSettings() {
        return {
            preGain: this.preGain,
            postGain: this.postGain,
            attackTime: this.attackTime,
            releaseTime: this.releaseTime,
            threshold: this.threshold,
            lookAheadTime: this.lookAheadTime
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
