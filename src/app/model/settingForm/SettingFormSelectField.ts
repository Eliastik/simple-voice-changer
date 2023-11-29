import SelectFormValue from "./SelectFormValue";
import SettingForm from "./SettingForm";
import { SettingFormTypeEnum } from "./SettingFormTypeEnum";

export default interface SettingFormSelectField extends SettingForm {
    settingType: SettingFormTypeEnum.SelectField,
    selectValues?: SelectFormValue[]
};