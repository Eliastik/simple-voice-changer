import Filter from "../Filter";
import { SettingFormType } from "../SettingFormType";

export const Lowpass: Filter = {
    filterId: "lowpass",
    filterName: "filters.lowpass.name",
    filterIcon: <svg height="1.75em" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path d="M24.22 67.796a3.995 3.995 0 0 1 4.008-3.991h85.498c8.834 0 19.732 6.112 24.345 13.657l53.76 87.936c3.46 5.66 11.628 10.247 18.256 10.247h16.718a3.996 3.996 0 0 1 3.994 4.007v8.985a4.007 4.007 0 0 1-4.007 4.008h-24.7c-8.835 0-19.709-6.13-24.283-13.683l-52.324-86.4c-3.43-5.665-11.577-10.257-18.202-10.257H28.214a3.995 3.995 0 0 1-3.993-3.992V67.796z" fillRule="evenodd" /></svg>,
    hasSettings: true,
    info: "filters.lowpass.info",
    settingsModalTitle: "filters.lowpass.settings.title",
    settingsForm: [
      {
        settingId: "labelInfo",
        settingTitle: "filters.lowpass.settings.label",
        settingType: SettingFormType.SimpleLabel
      },
      {
        settingId: "lowFrequency",
        settingTitle: "filters.lowpass.settings.lowFrequency",
        settingType: SettingFormType.NumberField
      }
    ]
  };