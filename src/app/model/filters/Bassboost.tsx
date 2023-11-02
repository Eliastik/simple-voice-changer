import Filter from "../Filter";
import { SettingFormTypeEnum } from "../settingForm/SettingFormTypeEnum";

export const Bassboost: Filter = {
    filterId: "bassboost",
    filterName: "filters.bassboost.name",
    filterIcon: <svg xmlns="http://www.w3.org/2000/svg" height="1.75em" viewBox="0 0 24 24" fill="currentColor"><path d="M12,12A3,3 0 0,0 9,15A3,3 0 0,0 12,18A3,3 0 0,0 15,15A3,3 0 0,0 12,12M12,20A5,5 0 0,1 7,15A5,5 0 0,1 12,10A5,5 0 0,1 17,15A5,5 0 0,1 12,20M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8C10.89,8 10,7.1 10,6C10,4.89 10.89,4 12,4M17,2H7C5.89,2 5,2.89 5,4V20A2,2 0 0,0 7,22H17A2,2 0 0,0 19,20V4C19,2.89 18.1,2 17,2Z" /></svg>,
    hasSettings: true,
    info: "filters.bassboost.info",
    settingsModalTitle: "filters.bassboost.settings.title",
    settingsForm: [
        {
            settingId: "labelInfo",
            settingTitle: "filters.bassboost.settings.label",
            settingType: SettingFormTypeEnum.SimpleLabel
        },
        {
            settingId: "frequencyBooster",
            settingTitle: "filters.bassboost.settings.frequencyBoost",
            settingType: SettingFormTypeEnum.NumberField
        },
        {
            settingId: "dbBooster",
            settingTitle: "filters.bassboost.settings.gainBoost",
            settingType: SettingFormTypeEnum.NumberField
        },
        {
            settingId: "frequencyReduce",
            settingTitle: "filters.bassboost.settings.attenuateFrequency",
            settingType: SettingFormTypeEnum.NumberField
        },
        {
            settingId: "dbReduce",
            settingTitle: "filters.bassboost.settings.gainAttenuate",
            settingType: SettingFormTypeEnum.NumberField
        }
    ]
};