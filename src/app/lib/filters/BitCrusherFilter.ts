import AbstractAudioFilterWorklet from "./interfaces/AbstractAudioFilterWorklet";
import Constants from "../model/Constants";
import worklets from "./worklets";
import BitCrusherSettings from "../model/filtersSettings/BitCrusherSettings";
import { FilterSettingValue, FilterSettings } from "../model/filtersSettings/FilterSettings";

export default class BitCrusherFilter extends AbstractAudioFilterWorklet {
    private channels = 2;
    private bits = 8;
    private normFreq = 0.15;

    constructor(channels: number, bits: number, normFreq: number) {
        super();
        this.channels = channels;
        this.bits = bits;
        this.normFreq = normFreq;
    }

    constructAudioWorkletProcessor(): any {
        return new worklets.BitCrusherProcessor();
    }

    get workletPath(): string {
        return Constants.WORKLET_PATHS.BITCRUSHER;
    }
    
    get workletName(): string {
        return Constants.WORKLET_NAMES.BITCRUSHER;
    }

    get order(): number {
        return 6;
    }

    get id(): string {
        return Constants.FILTERS_NAMES.BITCRUSHER;
    }

    getSettings(): BitCrusherSettings {
        return {
            channels: this.channels,
            bits: this.bits,
            normFreq: this.normFreq,
        };
    }

    async setSetting(settingId: string, value: FilterSettingValue) {
        if (!value || value == "" || isNaN(Number(value))) {
            return;
        }

        switch (settingId) {
        case "bits":
            this.bits = parseInt(value as string);
            break;
        case "normFreq":
            this.normFreq = parseFloat(value as string);
            break;
        }

        this.applyCurrentSettingsToWorklet();
    }
}
