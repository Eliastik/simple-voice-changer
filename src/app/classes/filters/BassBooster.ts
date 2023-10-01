import AbstractAudioFilter from "../AbstractAudioFilter";

export default class BassBooster extends AbstractAudioFilter {
    frequencyBooster = 200;
    frequencyReduce = 200;
    dbBooster = 15;
    dbReduce = -2;

    constructor(frequencyBooster: number, dbBooster: number, frequencyReduce: number, dbReduce: number) {
        super();
        this.frequencyBooster = frequencyBooster;
        this.dbBooster = dbBooster;
        this.frequencyReduce = frequencyReduce;
        this.dbReduce = dbReduce;
    }

    render(): JSX.Element {
        throw new Error("Method not implemented.");
    }

    getNode(context: AudioContext): AudioFilterNodes {
        const bassBoostFilter = context.createBiquadFilter();
        bassBoostFilter.type = "lowshelf";
        bassBoostFilter.frequency.value = this.frequencyBooster;
        bassBoostFilter.gain.value = this.dbBooster;

        const bassBoostFilterHighFreq = context.createBiquadFilter();
        bassBoostFilterHighFreq.type = "highshelf";
        bassBoostFilterHighFreq.frequency.value = this.frequencyReduce;
        bassBoostFilterHighFreq.gain.value = this.dbReduce;
        bassBoostFilterHighFreq.connect(bassBoostFilter);

        return {
            input: bassBoostFilter,
            output: bassBoostFilterHighFreq
        };
    }
}