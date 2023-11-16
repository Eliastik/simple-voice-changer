import Constants from "@/app/classes/model/Constants";
import Filter from "../Filter";
import { SettingFormTypeEnum } from "../settingForm/SettingFormTypeEnum";

export const Bitcrusher: Filter = {
    filterId: Constants.FILTERS_NAMES.BITCRUSHER,
    filterName: "filters.bitcrusher.name",
    filterIcon: <svg xmlns="http://www.w3.org/2000/svg" height="1.5em" viewBox="0 0 640 512" fill="currentColor"><path d="M192 64C86 64 0 150 0 256S86 448 192 448H448c106 0 192-86 192-192s-86-192-192-192H192zM496 168a40 40 0 1 1 0 80 40 40 0 1 1 0-80zM392 304a40 40 0 1 1 80 0 40 40 0 1 1 -80 0zM168 200c0-13.3 10.7-24 24-24s24 10.7 24 24v32h32c13.3 0 24 10.7 24 24s-10.7 24-24 24H216v32c0 13.3-10.7 24-24 24s-24-10.7-24-24V280H136c-13.3 0-24-10.7-24-24s10.7-24 24-24h32V200z" /></svg>,
    hasSettings: true,
    info: "filters.bitcrusher.info",
    settingsModalTitle: "filters.bitcrusher.settings.title",
    settingsForm: [
        {
            settingId: "labelInfo",
            settingTitle: "filters.bitcrusher.settings.label",
            settingType: SettingFormTypeEnum.SimpleLabel
        },
        {
            settingId: "bits",
            settingTitle: "filters.bitcrusher.settings.resolution",
            settingType: SettingFormTypeEnum.NumberField
        },
        {
            settingId: "normFreq",
            settingTitle: "filters.bitcrusher.settings.cutoffFrequency",
            settingType: SettingFormTypeEnum.NumberField
        }
    ]
};