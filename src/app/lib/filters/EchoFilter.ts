import AbstractAudioFilter from "./interfaces/AbstractAudioFilter";
import Constants from "../model/Constants";
import EchoSettings from "../model/filtersSettings/EchoSettings";
import { FilterSettingValue } from "../model/filtersSettings/FilterSettings";

export default class EchoFilter extends AbstractAudioFilter {
    private delay = 0.2;
    private gain = 0.75;

    constructor(delay: number, gain: number) {
        super();
        this.delay = delay;
        this.gain = gain;
    }

    getNode(context: BaseAudioContext) {
        const delayNode = context.createDelay(179);
        delayNode.delayTime.value = this.delay;

        const gainNode = context.createGain();
        gainNode.gain.value = this.gain;

        gainNode.connect(delayNode);
        delayNode.connect(gainNode);

        return {
            input: gainNode,
            output: delayNode
        };
    }
    
    get order(): number {
        return 7;
    }

    get id(): string {
        return Constants.FILTERS_NAMES.ECHO;
    }

    getAddingTime() {
        return 5;
    }

    getSettings(): EchoSettings {
        return {
            delay: this.delay,
            gain: this.gain
        };
    }

    async setSetting(settingId: string, value: FilterSettingValue) {
        if(typeof(value) === "undefined" || isNaN(Number(value))) {
            return;
        }
        
        switch(settingId) {
        case "delay":
            this.delay = parseFloat(value as string);
            break;
        case "gain":
            this.gain = parseFloat(value as string);
            break;
        }
    }
}
