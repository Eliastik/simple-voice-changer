import Constants from "../../model/Constants";

export default class BitCrusherProcessor extends AudioWorkletProcessor {
    private stopped = false;
    private phaser: number[] | null = null;
    private last: number[] | null = null;

    constructor() {
        super();
        this.port.onmessage = (event) => {
            if (event.data == "stop") {
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

    get defaultParameterDescriptors() {
        return BitCrusherProcessor.parameterDescriptors;
    }

    process(inputs: Float32Array[][], outputs: Float32Array[][], parameters: Record<string, Float32Array>): boolean {
        if (this.stopped) return false;

        const input = inputs[0];
        const output = outputs[0];

        const step = 2 * Math.pow(1 / 2, parameters.bits[0]);
        const currentNormFreq = parameters.normFreq[0] / (sampleRate / 48000);

        if (this.last == null) {
            this.last = new Array(input.length).fill(0);
        }

        if (this.phaser == null) {
            this.phaser = new Array(input.length).fill(0);
        }

        if (input && input[0]) {
            const blockSize = input[0].length;

            for (let channel = 0; channel < input.length; channel++) {
                const inp = input[channel];
                const out = output[channel];

                if (inp) {
                    for (let i = 0; i < blockSize; i++) {
                        this.phaser[channel] += currentNormFreq;

                        if (this.phaser[channel] >= 1.0) {
                            this.phaser[channel] -= 1.0;
                            this.last[channel] = step * Math.floor((inp[i] * (1 / step)) + 0.5);
                        }

                        out[i] = this.last[channel];
                    }
                }
            }
        }

        return true;
    }

    stop() {
        this.stopped = true;
        this.phaser = null;
        this.last = null;
    }
}

registerProcessor(Constants.WORKLET_NAMES.BITCRUSHER, BitCrusherProcessor);
