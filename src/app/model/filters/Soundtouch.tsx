import Constants from "@/app/classes/model/Constants";
import Filter from "../Filter";
import { SettingFormTypeEnum } from "../settingForm/SettingFormTypeEnum";

export const Soundtouch: Filter = {
    filterId: Constants.FILTERS_NAMES.SOUNDTOUCH,
    filterName: "filters.soundtouch.name",
    filterIcon: <svg xmlns="http://www.w3.org/2000/svg" height="1.5em" viewBox="0 0 512 512" fill="currentColor"><path d="M0 416c0 17.7 14.3 32 32 32l54.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48L480 448c17.7 0 32-14.3 32-32s-14.3-32-32-32l-246.7 0c-12.3-28.3-40.5-48-73.3-48s-61 19.7-73.3 48L32 384c-17.7 0-32 14.3-32 32zm128 0a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zM320 256a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm32-80c-32.8 0-61 19.7-73.3 48L32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l246.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48l54.7 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-54.7 0c-12.3-28.3-40.5-48-73.3-48zM192 128a32 32 0 1 1 0-64 32 32 0 1 1 0 64zm73.3-64C253 35.7 224.8 16 192 16s-61 19.7-73.3 48L32 64C14.3 64 0 78.3 0 96s14.3 32 32 32l86.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48L480 128c17.7 0 32-14.3 32-32s-14.3-32-32-32L265.3 64z" /></svg>,
    hasSettings: true,
    info: "filters.soundtouch.info",
    settingsModalTitle: "filters.soundtouch.settings.title",
    settingsForm: [
        {
            settingId: "labelInfo",
            settingTitle: "filters.soundtouch.settings.label",
            settingType: SettingFormTypeEnum.SimpleLabel
        },
        {
            settingId: "speedAudio",
            settingTitle: "filters.soundtouch.settings.speedAudio",
            settingType: SettingFormTypeEnum.Range,
            minValue: 0.1,
            maxValue: 5,
            minValueLabel: "filters.soundtouch.settings.speedAudioMinLabel",
            maxValueLabel: "filters.soundtouch.settings.speedAudioMaxLabel",
            displayCurrentValue: true,
            step: 0.01
        },
        {
            settingId: "frequencyAudio",
            settingTitle: "filters.soundtouch.settings.audioFrequency",
            settingType: SettingFormTypeEnum.Range,
            minValue: 0.1,
            maxValue: 5,
            minValueLabel: "filters.soundtouch.settings.audioFrequencyMinLabel",
            maxValueLabel: "filters.soundtouch.settings.audioFrequencyMaxLabel",
            displayCurrentValue: true,
            step: 0.01
        }
    ]
};