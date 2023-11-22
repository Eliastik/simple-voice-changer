class BitCrusherProcessor extends AudioWorkletProcessor {
  phaser = 0;
  last = 0;

  static get parameterDescriptors() {
    return [
      { name: "bits", defaultValue: 8 },
      { name: "normFreq", defaultValue: 0.15 },
    ];
  }

  process(inputs: Float32Array[][], outputs: Float32Array[][], parameters: Record<string, Float32Array>): boolean {
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
}

registerProcessor("bitcrusher-processor", BitCrusherProcessor);