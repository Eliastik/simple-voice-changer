//@ts-ignore
import { PitchShifter } from "soundtouchjs";
import AbstractAudioFilterEntrypoint from "../AbstractAudioFilterEntrypoint";

export default class SoundtouchWrapperFilter extends AbstractAudioFilterEntrypoint {
    currentPitchShifter: any;

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
}