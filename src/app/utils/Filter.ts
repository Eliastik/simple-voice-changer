import SettingForm from "./SettingForm";

export default interface Filter {
    filterId: string,
    filterName: string,
    filterIcon: JSX.Element,
    hasSettings: boolean,
    info: string,
    settingsForm?: SettingForm[],
    settingsModalTitle?: string,
    firstColumnStyle?: string,
    secondColumStyle?: string
}