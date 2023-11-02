import SettingForm from "./SettingForm";
import SettingFormDynamicLabel from "./SettingFormDynamicLabel";
import SettingFormDynamicLink from "./SettingFormDynamicLink";
import SettingFormNumberField from "./SettingFormNumberField";
import SettingFormRange from "./SettingFormRange";
import SettingFormSelectField from "./SettingFormSelectField";
import SettingFormSimpleLabel from "./SettingFormSimpleLabel";
import SettingFormSimpleLink from "./SettingFormSimpleLink";
import SettingFormTextField from "./SettingFormTextField";

export type SettingFormType = (SettingFormDynamicLabel | SettingFormDynamicLink | SettingFormNumberField | SettingFormRange | SettingFormSelectField | SettingFormSimpleLabel | SettingFormSimpleLink | SettingFormTextField);