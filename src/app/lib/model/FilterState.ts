import { FilterSettings } from "./filtersSettings/FilterSettings";

export interface FilterState {
    filterId: string;
    enabled: boolean;
    settings: FilterSettings
};
