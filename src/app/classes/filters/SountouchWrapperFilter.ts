//@ts-ignore
import { PitchShifter } from "soundtouchjs";
import AbstractAudioFilterEntrypoint from "../model/AbstractAudioFilterEntrypoint";

export default class SoundtouchWrapperFilter extends AbstractAudioFilterEntrypoint {
    private currentPitchShifter: any;
    private speedAudio = 1;
    private frequencyAudio = 1;

    constructor() {
        super();
        this.enable();
    }

    getEntrypointNode(context: BaseAudioContext, buffer: AudioBuffer): AudioFilterNodes {
        if(this.currentPitchShifter) {
            this.currentPitchShifter.disconnect();
        }

        this.currentPitchShifter = new PitchShifter(context, buffer, 16384);

        if(this.isEnabled()) {
            this.currentPitchShifter.tempo = this.speedAudio;
            this.currentPitchShifter.rate = this.frequencyAudio;
        }

        return {
            input: this.currentPitchShifter,
            output: this.currentPitchShifter
        };
    }
    
    getOrder(): number {
        return 2;
    }

    getId(): string {
        return "soundtouch";
    }

    getSettings() {
        return {
            speedAudio: this.speedAudio,
            frequencyAudio: this.frequencyAudio
        };
    }

    setSetting(settingId: string, value: string): void {
        if(!value || value == "" || isNaN(Number(value))) {
            return;
        }

        switch(settingId) {
            case "speedAudio":
                this.speedAudio = parseFloat(value);
                break;
            case "frequencyAudio":
                this.frequencyAudio = parseFloat(value);
                break;
            default:
                break;
        }
    }
}