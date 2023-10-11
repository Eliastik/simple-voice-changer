import AbstractAudioFilter from "../model/AbstractAudioFilter";

export default class BassBoosterFilter extends AbstractAudioFilter {
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

    getNode(context: BaseAudioContext): AudioFilterNodes {
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
    
    getOrder(): number {
        return 3;
    }

    getId(): string {
        return "bassboost";
    }

    getSettings(): any {
        return {
            frequencyBooster: this.frequencyBooster,
            frequencyReduce: this.frequencyReduce,
            dbBooster: this.dbBooster,
            dbReduce: this.dbReduce,
        };
    }

    setSetting(settingId: string, value: string): void {
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