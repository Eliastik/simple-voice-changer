import AbstractAudioFilter from "../model/AbstractAudioFilter";
import { AudioFilterNodes } from "../model/AudioNodes";
import Constants from "../model/Constants";
import vocoder from "../utils/Vocoder";

export default class VocoderFilter extends AbstractAudioFilter {

    getNode(context: BaseAudioContext): AudioFilterNodes {
        const modulatorBuffer = this.bufferFetcherService?.getAudioBuffer("modulator.mp3");

        const { modulatorGain, outputGain } = vocoder(context, modulatorBuffer!);

        return {
            input: modulatorGain!,
            output: outputGain!
        };
    }

    getSettings() {
        return {};
    }

    setSetting(settingId: string, value: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    
    get order(): number {
        return 1;
    }

    get id(): string {
        return Constants.FILTERS_NAMES.VOCODER;
    }
}
