import SelectFormValue from "./SelectFormValue";
import { SettingFormType } from "./SettingFormType";

export default interface SettingForm {
    settingId: string;
    settingTitle: string;
    settingType: SettingFormType,
    minValue?: number,
    maxValue?: number,
    defaultValue?: string,
    selectValues?: SelectFormValue[],
    labelValue?: string,
    linkValue?: string,
    displayCondition?: (filterSettings: any) => boolean,
    cssClass?: string
    startIcon?: JSX.Element
};