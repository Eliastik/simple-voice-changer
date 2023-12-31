import AbstractAudioFilter from "./interfaces/AbstractAudioFilter";
import Constants from "../model/Constants";
import BassBoosterSettings from "../model/filtersSettings/BassBoosterSettings";
import { FilterSettingValue } from "../model/filtersSettings/FilterSettings";
import utilFunctions from "../utils/Functions";

export default class BassBoosterFilter extends AbstractAudioFilter {
    private frequencyBooster = 200;
    private frequencyReduce = 200;
    private dbBooster = 15;
    private dbReduce = -2;

    constructor(frequencyBooster: number, dbBooster: number, frequencyReduce: number, dbReduce: number) {
        super();
        this.frequencyBooster = frequencyBooster;
        this.dbBooster = dbBooster;
        this.frequencyReduce = frequencyReduce;
        this.dbReduce = dbReduce;
    }

    getNode(context: BaseAudioContext) {
        const bassBoostFilter = context.createBiquadFilter();
        bassBoostFilter.type = "lowshelf";
        bassBoostFilter.frequency.value = this.frequencyBooster;
        bassBoostFilter.gain.value = this.dbBooster;

        const bassBoostFilterHighFreq = context.createBiquadFilter();
        bassBoostFilterHighFreq.type = "highshelf";
        bassBoostFilterHighFreq.frequency.value = this.frequencyReduce;
        bassBoostFilterHighFreq.gain.value = this.dbReduce;
        bassBoostFilterHighFreq.connect(bassBoostFilter);

        return {
            input: bassBoostFilterHighFreq,
            output: bassBoostFilter
        };
    }
    
    get order(): number {
        return 3;
    }

    get id(): string {
        return Constants.FILTERS_NAMES.BASS_BOOST;
    }

    getSettings(): BassBoosterSettings {
        return {
            frequencyBooster: this.frequencyBooster,
            frequencyReduce: this.frequencyReduce,
            dbBooster: this.dbBooster,
            dbReduce: this.dbReduce,
        };
    }

    async setSetting(settingId: string, value: FilterSettingValue) {
        if(!utilFunctions.isSettingValueValid(value)) {
            return;
        }

        switch(settingId) {
        case "frequencyBooster":
            this.frequencyBooster = parseInt(value as string);
            break;
        case "frequencyReduce":
            this.frequencyReduce = parseInt(value as string);
            break;
        case "dbBooster":
            this.dbBooster = parseInt(value as string);
            break;
        case "dbReduce":
            this.dbReduce = parseInt(value as string);
            break;
        }
    }
}
