import AbstractAudioFilter from "../model/AbstractAudioFilter";
import Constants from "../model/Constants";

export default class LowPassFilter extends AbstractAudioFilter {
    private lowFrequency = 3500;

    constructor(lowFrequency: number) {
        super();
        this.lowFrequency = lowFrequency;
    }
    
    getNode(context: BaseAudioContext) {
        const lowPassFilter = context.createBiquadFilter();
        lowPassFilter.type = "lowpass";
        lowPassFilter.frequency.value = this.lowFrequency;

        return {
            input: lowPassFilter,
            output: lowPassFilter
        };
    }
    
    getOrder(): number {
        return 5;
    }

    getId(): string {
        return Constants.FILTERS_NAMES.LOW_PASS;
    }

    getSettings() {
        return {
            lowFrequency: this.lowFrequency
        };
    }

    async setSetting(settingId: string, value: string) {
        if(!value || value == "" || isNaN(Number(value))) {
            return;
        }
        
        switch (settingId) {
        case "lowFrequency":
            this.lowFrequency = parseInt(value);
            break;
        }
    }
}