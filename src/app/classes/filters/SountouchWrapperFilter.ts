//@ts-ignore
import { PitchShifter } from "soundtouchjs";
import AbstractAudioFilterEntrypoint from "../model/AbstractAudioFilterEntrypoint";
import Constants from "../model/Constants";

export default class SoundtouchWrapperFilter extends AbstractAudioFilterEntrypoint {

    private currentPitchShifter: any;
    private speedAudio = 1;
    private frequencyAudio = 1;
    private currentSpeedAudio = 1;

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
        this.updateState();

        return {
            input: this.currentPitchShifter,
            output: this.currentPitchShifter
        };
    }
    
    getOrder(): number {
        return 2;
    }

    getId(): string {
        return Constants.FILTERS_NAMES.SOUNDTOUCH;
    }

    getSettings() {
        return {
            speedAudio: this.speedAudio,
            frequencyAudio: this.frequencyAudio
        };
    }

    updateState(): void {
        if(this.currentPitchShifter && this.isEnabled()) {
            this.currentPitchShifter.tempo = this.speedAudio;
            this.currentSpeedAudio = this.speedAudio;
        } else {
            this.currentPitchShifter.tempo = 1;
            this.currentSpeedAudio = 1;
        }

        if(this.currentPitchShifter && this.isEnabled()) {
            this.currentPitchShifter.pitch = this.frequencyAudio;
        } else {
            this.currentPitchShifter.pitch = 1;
        }
    }

    async setSetting(settingId: string, value: string) {
        if(!value || value == "" || isNaN(Number(value))) {
            return;
        }

        const valueFloat = parseFloat(value);

        switch(settingId) {
            case "speedAudio":
                this.speedAudio = valueFloat;
                break;
            case "frequencyAudio":
                this.frequencyAudio = valueFloat;
                break;
            default:
                break;
        }

        this.updateState();
    }

    getSpeed(): number {
        return this.currentSpeedAudio;
    }
}