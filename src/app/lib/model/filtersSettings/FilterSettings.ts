import GenericSettingValue from "./GenericSettingValue";

export type FilterSettingValue = string | number | GenericSettingValue | string[] | undefined;

export interface FilterSettings {
    [key: string]: FilterSettingValue,
    downloadedBuffers?: string[]
};
