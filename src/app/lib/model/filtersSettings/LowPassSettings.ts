import { FilterSettings } from "./FilterSettings";

export default interface LowPassSettings extends FilterSettings {
    lowFrequency: number
};
