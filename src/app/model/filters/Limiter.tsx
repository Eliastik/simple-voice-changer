import Constants from "@/app/lib/model/Constants";
import Filter from "../Filter";
import { SettingFormTypeEnum } from "../settingForm/SettingFormTypeEnum";

export const Limiter: Filter = {
    filterId: Constants.FILTERS_NAMES.LIMITER,
    filterName: "filters.limiter.name",
    hasSettings: true,
    filterIcon: <svg xmlns="http://www.w3.org/2000/svg" height="1.5em" viewBox="0 0 512 512" fill="currentColor"><path d="M0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm320 96c0-26.9-16.5-49.9-40-59.3V88c0-13.3-10.7-24-24-24s-24 10.7-24 24V292.7c-23.5 9.5-40 32.5-40 59.3c0 35.3 28.7 64 64 64s64-28.7 64-64zM144 176a32 32 0 1 0 0-64 32 32 0 1 0 0 64zm-16 80a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm288 32a32 32 0 1 0 0-64 32 32 0 1 0 0 64zM400 144a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z" /></svg>,
    info: "filters.limiter.info",
    settingsModalTitle: "filters.limiter.settings.title",
    settingsForm: [
        {
            settingId: "labelInfo",
            settingTitle: "filters.limiter.settings.label",
            settingType: SettingFormTypeEnum.SimpleLabel
        },
        {
            settingId: "preGain",
            settingTitle: "filters.limiter.settings.preGain",
            settingType: SettingFormTypeEnum.NumberField
        },
        {
            settingId: "postGain",
            settingTitle: "filters.limiter.settings.postGain",
            settingType: SettingFormTypeEnum.NumberField
        },
        {
            settingId: "attackTime",
            settingTitle: "filters.limiter.settings.attackTime",
            settingType: SettingFormTypeEnum.NumberField
        },
        {
            settingId: "releaseTime",
            settingTitle: "filters.limiter.settings.releaseTime",
            settingType: SettingFormTypeEnum.NumberField
        },
        {
            settingId: "threshold",
            settingTitle: "filters.limiter.settings.threshold",
            settingType: SettingFormTypeEnum.NumberField
        },
        {
            settingId: "lookAheadTime",
            settingTitle: "filters.limiter.settings.lookAheadTime",
            settingType: SettingFormTypeEnum.NumberField
        }
    ]
};
