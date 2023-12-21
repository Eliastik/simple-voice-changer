import { FilterSettings } from "./FilterSettings";
import GenericSettingValue from "./GenericSettingValue";

export default interface ExtendedFilterSettings extends FilterSettings {
    reverbEnvironment?: GenericSettingValue
};
