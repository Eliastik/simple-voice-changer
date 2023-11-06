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
        this.setDefaultEnabled(true);
    }

    getEntrypointNode(context: BaseAudioContext, buffer: AudioBuffer): AudioFilterNodes {
        if(this.currentPitchShifter) {
            this.currentPitchShifter.disconnect();
        }

        this.currentPitchShifter = new PitchShifter(context, buffer, 16384);

        if(this.isEnabled()) {
            this.currentPitchShifter.tempo = this.speedAudio;
            this.currentPitchShifter.pitch = this.frequencyAudio;
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

    async setSetting(settingId: string, value: string) {
        if(!value || value == "" || isNaN(Number(value))) {
            return;
        }

        const valueFloat = parseFloat(value);

        switch(settingId) {
            case "speedAudio":
                if(this.currentPitchShifter) {
                    this.currentPitchShifter.tempo = valueFloat;
                }

                this.speedAudio = valueFloat;
                break;
            case "frequencyAudio":
                if(this.currentPitchShifter) {
                    this.currentPitchShifter.pitch = valueFloat;
                }

                this.frequencyAudio = valueFloat;
                break;
            default:
                break;
        }
    }

    getSpeed(): number {
        return this.speedAudio;
    }
}