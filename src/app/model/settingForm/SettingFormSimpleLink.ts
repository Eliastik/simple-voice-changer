import SettingForm from "./SettingForm";
import { SettingFormTypeEnum } from "./SettingFormTypeEnum";

export default interface SettingFormSimpleLink extends SettingForm {
    settingType: SettingFormTypeEnum.SimpleLink
    labelValue?: string
    linkValue?: string
};