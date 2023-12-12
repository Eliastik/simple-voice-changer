import AbstractAudioFilter from "../model/AbstractAudioFilter";
import Constants from "../model/Constants";

export default class BassBoosterFilter extends AbstractAudioFilter {
    private frequencyBooster = 200;
    private frequencyReduce = 200;
    private dbBooster = 15;
    private dbReduce = -2;

    constructor(frequencyBooster: number, dbBooster: number, frequencyReduce: number, dbReduce: number) {
        super();
        this.frequencyBooster = frequencyBooster;
        this.dbBooster = dbBooster;
        this.frequencyReduce = frequencyReduce;
        this.dbReduce = dbReduce;
    }

    getNode(context: BaseAudioContext) {
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
            input: bassBoostFilterHighFreq,
            output: bassBoostFilter
        };
    }
    
    get order(): number {
        return 3;
    }

    get id(): string {
        return Constants.FILTERS_NAMES.BASS_BOOST;
    }

    getSettings() {
        return {
            frequencyBooster: this.frequencyBooster,
            frequencyReduce: this.frequencyReduce,
            dbBooster: this.dbBooster,
            dbReduce: this.dbReduce,
        };
    }

    async setSetting(settingId: string, value: string) {
        if(!value || value == "" || isNaN(Number(value))) {
            return;
        }

        switch(settingId) {
        case "frequencyBooster":
            this.frequencyBooster = parseInt(value);
            break;
        case "frequencyReduce":
            this.frequencyReduce = parseInt(value);
            break;
        case "dbBooster":
            this.dbBooster = parseInt(value);
            break;
        case "dbReduce":
            this.dbReduce = parseInt(value);
            break;
        }
    }
}
