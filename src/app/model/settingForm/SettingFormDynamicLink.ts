import SettingForm from "./SettingForm";
import { SettingFormTypeEnum } from "./SettingFormTypeEnum";

export default interface SettingFormDynamicLink extends SettingForm {
    settingType: SettingFormTypeEnum.DynamicLink
    labelValue?: string
    linkValue?: string
};