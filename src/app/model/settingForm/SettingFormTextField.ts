import SettingForm from "./SettingForm";
import { SettingFormTypeEnum } from "./SettingFormTypeEnum";

export default interface SettingFormTextField extends SettingForm {
    settingType: SettingFormTypeEnum.TextField
};