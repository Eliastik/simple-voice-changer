import SettingForm from "./SettingForm";
import { SettingFormTypeEnum } from "./SettingFormTypeEnum";

export default interface SettingFormSimpleLabel extends SettingForm {
    settingType: SettingFormTypeEnum.SimpleLabel
    labelValue?: string
};