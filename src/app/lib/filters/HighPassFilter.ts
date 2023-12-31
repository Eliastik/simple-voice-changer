import AbstractAudioFilter from "./interfaces/AbstractAudioFilter";
import Constants from "../model/Constants";
import HighPassSettings from "../model/filtersSettings/HighPassSettings";
import { FilterSettingValue } from "../model/filtersSettings/FilterSettings";
import utilFunctions from "../utils/Functions";

export default class HighPassFilter extends AbstractAudioFilter {
    private highFrequency = 3500;

    constructor(highFrequency: number) {
        super();
        this.highFrequency = highFrequency;
    }

    getNode(context: BaseAudioContext) {
        const highPassFilter = context.createBiquadFilter();
        highPassFilter.type = "highpass";
        highPassFilter.frequency.value = this.highFrequency;

        return {
            input: highPassFilter,
            output: highPassFilter
        };
    }
    
    get order(): number {
        return 4;
    }

    get id(): string {
        return Constants.FILTERS_NAMES.HIGH_PASS;
    }

    getSettings(): HighPassSettings {
        return {
            highFrequency: this.highFrequency
        };
    }

    async setSetting(settingId: string, value: FilterSettingValue) {
        if(!utilFunctions.isSettingValueValid(value)) {
            return;
        }
        
        switch(settingId) {
        case "highFrequency":
            this.highFrequency = parseInt(value as string);
            break;
        }
    }
}
