import Constants from "@/app/lib/model/Constants";
import Filter from "../Filter";
import { SettingFormTypeEnum } from "../settingForm/SettingFormTypeEnum";

export const Highpass: Filter = {
    filterId: Constants.FILTERS_NAMES.HIGH_PASS,
    filterName: "filters.highpass.name",
    filterIcon: <svg height="1.75em" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path d="m231.007 68.729c0-2.206-1.787-4.995-4.007-4.995h-85.499c-6.466 0-19.531 7.705-22.66 15.97l-55.92 85.647c-3.624 5.55-11.93 10.05-18.559 10.05h-16.195c-2.206 0-3.994 2.787-3.994 5.007v8.985a4.005 4.005 0 0 0 3.998 4.007h22.713c8.832 0 20.495-8.703 23.588-16.987l56.167-84.189c3.68-5.517 12.04-9.99 18.668-9.99h77.695c2.212 0 4.005-2.797 4.005-4.994v-8.51z" fillRule="evenodd" /></svg>,
    hasSettings: true,
    info: "filters.highpass.info",
    settingsModalTitle: "filters.highpass.settings.title",
    settingsForm: [
        {
            settingId: "labelInfo",
            settingTitle: "filters.highpass.settings.label",
            settingType: SettingFormTypeEnum.SimpleLabel
        },
        {
            settingId: "highFrequency",
            settingTitle: "filters.highpass.settings.highFrequency",
            settingType: SettingFormTypeEnum.NumberField
        }
    ]
};
