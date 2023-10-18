//@ts-ignore
import { PitchShifter } from "soundtouchjs";
import AbstractAudioFilterEntrypoint from "../model/AbstractAudioFilterEntrypoint";

export default class SoundtouchWrapperFilter extends AbstractAudioFilterEntrypoint {
    private currentPitchShifter: any;

    constructor() {
        super();
    }

    getNode(context: BaseAudioContext, buffer: AudioBuffer): AudioFilterNodes {
        this.currentPitchShifter = new PitchShifter(context, buffer, 16384);

        return {
            input: this.currentPitchShifter,
            output: this.currentPitchShifter
        };
    }
    
    getOrder(): number {
        return 2;
    }

    isEnabled(): boolean {
        return true;
    }

    getId(): string {
        return "soundtouch";
    }

    getSettings() {
        return {};
    }

    setSetting(settingId: string, value: string): void {
        throw new Error("Method not implemented.");
    }
}