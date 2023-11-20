class BitCrusherProcessor extends AudioWorkletProcessor {
    bits = 8;
    normFreq = 0.15;
    phaser = 0;
    last = 0;

    constructor() {
        super();
    }

    process(inputs, outputs, parameters) {
        const input = inputs[0];
        const output = outputs[0];

        const step = 2 * Math.pow(1 / 2, this.bits);
        const currentNormFreq = this.normFreq / (sampleRate / 48000);

        for (let channel = 0; channel < input.length; channel++) {
            for (let i = 0; i < input[channel].length; i++) {
                this.phaser += currentNormFreq;

                if (this.phaser >= 1.0) {
                    this.phaser -= 1.0;
                    this.last = step * Math.floor((input[channel][i] * (1 / step)) + 0.5);
                }

                output[channel][i] = this.last;
            }
        }

        return true;
    }
}

registerProcessor("bitcrusher-processor", BitCrusherProcessor);