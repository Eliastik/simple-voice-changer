import { FilterSettings } from "./FilterSettings";

export default interface BassBoosterSettings extends FilterSettings {
    frequencyBooster: number,
    frequencyReduce: number
    dbBooster: number
    dbReduce: number
};
