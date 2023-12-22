import AbstractAudioFilter from "./interfaces/AbstractAudioFilter";
import Constants from "../model/Constants";
import { FilterSettingValue } from "../model/filtersSettings/FilterSettings";

export default class BitCrusherFilter extends AbstractAudioFilter {

    getNode(context: BaseAudioContext) {
        const lpf1 = context.createBiquadFilter();
        lpf1.type = "lowpass";
        lpf1.frequency.value = 2000.0;
        const lpf2 = context.createBiquadFilter();
        lpf2.type = "lowpass";
        lpf2.frequency.value = 2000.0;
        const hpf1 = context.createBiquadFilter();
        hpf1.type = "highpass";
        hpf1.frequency.value = 500.0;
        const hpf2 = context.createBiquadFilter();
        hpf2.type = "highpass";
        hpf2.frequency.value = 500.0;
        lpf1.connect(lpf2);
        lpf2.connect(hpf1);
        hpf1.connect(hpf2);
    
        return {
            input: lpf1,
            output: hpf2
        };
    }
    
    get order(): number {
        return 7;
    }

    get id(): string {
        return Constants.FILTERS_NAMES.TELEPHONIZER;
    }

    getSettings() {
        return {};
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async setSetting(settingId: string, value: FilterSettingValue) {
        throw new Error("Method not implemented.");
    }
}
