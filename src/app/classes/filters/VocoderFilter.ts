import AbstractAudioFilter from "../model/AbstractAudioFilter";
import { AudioFilterNodes } from "../model/AudioNodes";
import Constants from "../model/Constants";
import Vocoder from "../utils/Vocoder";

export default class VocoderFilter extends AbstractAudioFilter {

    getNode(context: BaseAudioContext): AudioFilterNodes {
        const modulatorBuffer = this.bufferFetcherService?.getAudioBuffer(Constants.VOCODER_MODULATOR);

        const vocoder = new Vocoder(context, modulatorBuffer!);
        vocoder.init();

        const { modulatorGain, outputGain } = vocoder.getNodes();

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
