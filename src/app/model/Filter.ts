import { SettingFormType } from "./settingForm/SettingFormType";
export default interface Filter {
    filterId: string,
    filterName: string,
    filterIcon: JSX.Element,
    hasSettings: boolean,
    info: string,
    settingsForm?: SettingFormType[],
    settingsModalTitle?: string,
    firstColumnStyle?: string,
    secondColumStyle?: string,
    disabledCondition?: (filterSettings: any) => string | null
};
