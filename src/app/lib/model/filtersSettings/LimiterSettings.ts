import { FilterSettings } from "./FilterSettings";

export default interface LimiterSettings extends FilterSettings {
    preGain: number,
    postGain: number,
    attackTime: number,
    releaseTime: number,
    threshold: number,
    lookAheadTime: number
};
