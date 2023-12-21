import AbstractAudioFilter from "./interfaces/AbstractAudioFilter";
import Constants from "../model/Constants";

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

    getSettings() {
        return {
            delay: this.delay,
            gain: this.gain
        };
    }

    async setSetting(settingId: string, value: string) {
        if(!value || value == "" || isNaN(Number(value))) {
            return;
        }
        
        switch(settingId) {
        case "delay":
            this.delay = parseFloat(value);
            break;
        case "gain":
            this.gain = parseFloat(value);
            break;
        }
    }
}
