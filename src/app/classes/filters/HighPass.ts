import AbstractAudioFilter from "../AbstractAudioFilter";

export default class HighPass extends AbstractAudioFilter {
    highFrequency = 3500;

    constructor(highFrequency: number) {
        super();
        this.highFrequency = highFrequency;
    }

    render(): JSX.Element {
        throw new Error("Method not implemented.");
    }

    getNode(context: AudioContext): AudioFilterNodes {
        const highPassFilter = context.createBiquadFilter();
        highPassFilter.type = "highpass";
        highPassFilter.frequency.value = this.highFrequency;

        return {
            input: highPassFilter,
            output: highPassFilter
        };
    }
}