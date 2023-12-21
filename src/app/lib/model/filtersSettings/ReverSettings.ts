import { FilterSettings } from "./FilterSettings";

export default interface HighPassSettings extends FilterSettings {
    lowFrequency: number
};
