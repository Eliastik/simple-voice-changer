import { FilterSettings } from "./FilterSettings";

export default interface EchoSettings extends FilterSettings {
    delay: number
    gain: number
};
