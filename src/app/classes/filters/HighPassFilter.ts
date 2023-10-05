import AbstractAudioFilter from "../AbstractAudioFilter";

export default class HighPassFilter extends AbstractAudioFilter {
    highFrequency = 3500;

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
}