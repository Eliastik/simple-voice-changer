import Constants from "../../model/Constants";

export default class BitCrusherProcessor extends AudioWorkletProcessor {
    private stopped = false;
    private phaser = 0;
    private last = 0;

    constructor() {
        super();
        this.port.onmessage = (event) => {
            if(event.data == "stop") {
                this.stop();
            }
        };
    }

    static get parameterDescriptors() {
        return [
            { name: "bits", defaultValue: 8 },
            { name: "normFreq", defaultValue: 0.15 },
        ];
    }

    getDefaultParameterDescriptors() {
        return BitCrusherProcessor.parameterDescriptors;
    }

    process(inputs: Float32Array[][], outputs: Float32Array[][], parameters: Record<string, Float32Array>): boolean {
        if(this.stopped) return false;
        
        const input = inputs[0];
        const output = outputs[0];

        const step = 2 * Math.pow(1 / 2, parameters.bits[0]);
        const currentNormFreq = parameters.normFreq[0] / (sampleRate / 48000);

        for (let channel = 0; channel < input.length; channel++) {
            for (let i = 0; i < input[channel].length; i++) {
                this.phaser += currentNormFreq;

                if (this.phaser >= 1.0) {
                    this.phaser -= 1.0;
                    this.last = step * Math.floor(input[channel][i] * (1 / step) + 0.5);
                }

                output[channel][i] = this.last;
            }
        }

        return true;
    }

    stop() {
        this.stopped = true;
    }
}

registerProcessor(Constants.WORKLET_NAMES.BITCRUSHER, BitCrusherProcessor);
