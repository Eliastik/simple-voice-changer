import { FilterSettings } from "./FilterSettings";

export default interface BitCrusherSettings extends FilterSettings {
    channels: number
    bits: number
    normFreq: number
};
