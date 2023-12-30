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

    process(inputs: Float32Array[][]): boolean {
        if (!this.recording) return true;

        const input = inputs[0];
        const buffer: Float32Array[] = [];

        if (input) {
            for (let channel = 0; channel < input.length; channel++) {
                buffer.push(input[channel]);
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
