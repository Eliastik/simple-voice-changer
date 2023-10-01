import AbstractAudioFilter from "../AbstractAudioFilter";

export default class LowPass extends AbstractAudioFilter {
    lowFrequency = 3500;

    constructor(lowFrequency: number) {
        super();
        this.lowFrequency = lowFrequency;
    }

    render(): JSX.Element {
        throw new Error("Method not implemented.");
    }

    getNode(context: AudioContext): AudioFilterNodes {
        const lowPassFilter = context.createBiquadFilter();
        lowPassFilter.type = "lowpass";
        lowPassFilter.frequency.value = this.lowFrequency;

        return {
            input: lowPassFilter,
            output: lowPassFilter
        };
    }
}