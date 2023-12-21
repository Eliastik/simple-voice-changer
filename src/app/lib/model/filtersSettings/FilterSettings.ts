import GenericSettingValue from "./GenericSettingValue";

export interface FilterSettings {
    [key: string]: number | GenericSettingValue | string[] | undefined,
    downloadedBuffers?: string[]
};
