import SettingForm from "./SettingForm";
import { SettingFormTypeEnum } from "./SettingFormTypeEnum";

export default interface SettingFormDynamicLabel extends SettingForm {
    settingType: SettingFormTypeEnum.DynamicLabel
    labelValue?: string
}