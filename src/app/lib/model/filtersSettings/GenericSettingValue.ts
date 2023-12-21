import GenericSettingValueAdditionalData from "./GenericSettingValueAdditionalData";

export default interface SelectFormValue {
    [key: string]: string | GenericSettingValueAdditionalData | undefined,
    name: string;
    value: string;
    additionalData?: GenericSettingValueAdditionalData;
};
