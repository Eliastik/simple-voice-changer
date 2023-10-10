import SelectFormValue from "./selectFormValue";
import { SettingFormType } from "./settingFormType";

export default interface SettingForm {
    settingId: string;
    settingTitle: string;
    settingType: SettingFormType,
    minValue?: number,
    maxValue?: number,
    selectValues?: SelectFormValue[]
};