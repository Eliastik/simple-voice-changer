import Constants from "../../model/Constants";

export default class RecorderWorklet extends AudioWorkletProcessor {
    private recording = false;

    constructor() {
        super();
        this.port.onmessage = (event) => {
            if (event.data == "stop") {
                this.recording = false;
            } else if(event.data == "record") {
                this.recording = true;
            }
        };
    }

    static get parameterDescriptors() {
        return [
            { name: "numChannels", defaultValue: 2 }
        ];
    }

    process(inputs: Float32Array[][], outputs: Float32Array[][], parameters: Record<string, Float32Array>): boolean {
        if (!this.recording) return true;

        const input = inputs[0];
        const buffer: Float32Array[] = [];

        if (input && input.length > 0) {
            for (let channel = 0; channel < parameters.numChannels[0]; channel++) {
                if (input[channel]) {
                    buffer.push(input[channel]);
                } else {
                    buffer.push(input[0]);
                }
            }

            this.port.postMessage({
                command: "record",
                buffer: buffer
            });
        }

        return true;
    }
}

registerProcessor(Constants.WORKLET_NAMES.RECORDER_WORKLET, RecorderWorklet);
