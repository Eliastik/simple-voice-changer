import SettingForm from "./SettingForm";
import { SettingFormTypeEnum } from "./SettingFormTypeEnum";

export default interface SettingFormRange extends SettingForm {
    settingType: SettingFormTypeEnum.Range
    minValue?: number,
    maxValue?: number,
    minValueLabel?: string,
    maxValueLabel?: string
    displayCurrentValue?: boolean,
    step?: number
}