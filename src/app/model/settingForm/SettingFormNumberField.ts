import SettingForm from "./SettingForm";
import { SettingFormTypeEnum } from "./SettingFormTypeEnum";

export default interface SettingFormNumberField extends SettingForm {
    settingType: SettingFormTypeEnum.NumberField
    minValue?: number,
    maxValue?: number,
    step?: number
};