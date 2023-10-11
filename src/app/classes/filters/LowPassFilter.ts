import AbstractAudioFilter from "../model/AbstractAudioFilter";

export default class LowPassFilter extends AbstractAudioFilter {
    lowFrequency = 3500;

    constructor(lowFrequency: number) {
        super();
        this.lowFrequency = lowFrequency;
    }
    
    getNode(context: BaseAudioContext): AudioFilterNodes {
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
        return "lowpass";
    }

    getSettings() {
        return {
            lowFrequency: this.lowFrequency
        };
    }

    setSetting(settingId: string, value: string): void {
        throw new Error("Method not implemented.");
    }
}