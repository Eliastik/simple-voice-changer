import { FilterSettings } from "./FilterSettings";
import GenericSettingValue from "./GenericSettingValue";

export default interface ReverbSettings extends FilterSettings {
    reverbEnvironment?: GenericSettingValue
};
