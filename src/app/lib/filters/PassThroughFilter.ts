import AbstractAudioFilter from "./interfaces/AbstractAudioFilter";
import Constants from "../model/Constants";
import { FilterSettingValue } from "../model/filtersSettings/FilterSettings";

export default class PassThroughFilter extends AbstractAudioFilter {

    private gainNode: GainNode | undefined = undefined;

    constructor() {
        super();
    }

    getNode(context: BaseAudioContext) {
        if (!this.gainNode || context != this.gainNode.context) {
            this.gainNode = new GainNode(context);
        }

        return {
            input: this.gainNode,
            output: this.gainNode,
        };
    }

    get order(): number {
        return Number.MAX_SAFE_INTEGER;
    }

    get id(): string {
        return Constants.FILTERS_NAMES.PASS_THROUGH;
    }

    getSettings() {
        return {};
    }

    isEnabled(): boolean {
        return true;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async setSetting(settingId: string, value: FilterSettingValue) { }
}
