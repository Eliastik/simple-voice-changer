import AbstractAudioFilter from "../model/AbstractAudioFilter";

export default class BitCrusherFilter extends AbstractAudioFilter {
    bufferSize = 4096;
    channels = 2;
    bits = 8;
    normFreq = 0.15;

    constructor(bufferSize: number, channels: number, bits: number, normFreq: number) {
        super();
        this.bufferSize = bufferSize;
        this.channels = channels;
        this.bits = bits;
        this.normFreq = normFreq;
    }

    getNode(context: BaseAudioContext): AudioFilterNodes {
        const bitCrusher = context.createScriptProcessor(this.bufferSize, this.channels, this.channels);
        let phaser = 0;
        let last = 0;
        this.normFreq /= (context.sampleRate / 48000);

        bitCrusher.onaudioprocess = e => {
            const step = 2 * Math.pow(1 / 2, this.bits);

            for(let channel = 0; channel < e.inputBuffer.numberOfChannels; channel++) {
                const input = e.inputBuffer.getChannelData(channel);
                const output = e.outputBuffer.getChannelData(channel);

                for(let i = 0; i < this.bufferSize; i++) {
                    phaser += this.normFreq;

                    if(phaser >= 1.0) {
                        phaser -= 1.0;
                        last = step * Math.floor((input[i] * (1 / step)) + 0.5);
                    }

                    output[i] = last;
                }
            }
        };

        return {
            input: bitCrusher,
            output: bitCrusher
        };
    }
    
    getOrder(): number {
        return 6;
    }

    isEnabled(): boolean {
        return false;
    }

    getId(): string {
        return "bitcrusher";
    }
}