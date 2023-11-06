import AbstractAudioFilter from "../model/AbstractAudioFilter";

export default class HighPassFilter extends AbstractAudioFilter {
    private highFrequency = 3500;

    constructor(highFrequency: number) {
        super();
        this.highFrequency = highFrequency;
    }

    getNode(context: BaseAudioContext): AudioFilterNodes {
        const highPassFilter = context.createBiquadFilter();
        highPassFilter.type = "highpass";
        highPassFilter.frequency.value = this.highFrequency;

        return {
            input: highPassFilter,
            output: highPassFilter
        };
    }
    
    getOrder(): number {
        return 4;
    }

    getId(): string {
        return "highpass";
    }

    getSettings() {
        return {
            highFrequency: this.highFrequency
        };
    }

    async setSetting(settingId: string, value: string) {
        if(!value || value == "" || isNaN(Number(value))) {
            return;
        }
        
        switch(settingId) {
            case "highFrequency":
                this.highFrequency = parseInt(value);
                break;
        }
    }
}