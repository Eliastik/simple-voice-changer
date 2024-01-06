import { FilterSettings } from "@eliastik/simple-sound-studio-lib/lib/model/filtersSettings/FilterSettings";
import { SettingFormTypeEnum } from "./SettingFormTypeEnum";

export default interface SettingForm {
    settingId: string;
    settingTitle: string;
    settingType: SettingFormTypeEnum,
    defaultValue?: string,
    cssClass?: string
    startIcon?: JSX.Element,
    displayCondition?: (filterSettings: FilterSettings) => boolean
};
