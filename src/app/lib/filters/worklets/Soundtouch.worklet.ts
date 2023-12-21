//@ts-ignore
import { SoundTouch } from "soundtouchjs";
import SoundtouchCustomFilter from "../../utils/SoundtouchCustomFilter";
import SoundtouchWorkletOptions from "../../model/SoundtouchWorkletOptions";
import Constants from "../../model/Constants";

export default class SoundTouchWorkletProcessor extends AudioWorkletProcessor {
    private name: string;
    private options: SoundtouchWorkletOptions; // Change the type accordingly
    nOutputFrames: number;
    private nVirtualOutputFrames: number;
    private playingAt: number;
    private lastPlayingAt: number;
    private updateInterval: number;
    private soundtouch: SoundTouch;
    private filter: SoundtouchCustomFilter;
    private recordedSamples: Float32Array[][];
    private inSamples: Float32Array;
    private outSamples: Float32Array;
    private running = false;

    constructor(options: AudioWorkletNodeOptions) {
        super();
        this.name = this.constructor.name;
        this.options = options.processorOptions;

        this.nOutputFrames = 0;
        this.nVirtualOutputFrames = 0;

        this.playingAt = 0;
        this.lastPlayingAt = 0;

        this.updateInterval = this.options.updateInterval;
        this.soundtouch = new SoundTouch();
        this.filter = new SoundtouchCustomFilter(this.soundtouch, () => { });
        this.recordedSamples = [[], []];

        this.inSamples = new Float32Array(128 * 2);
        this.outSamples = new Float32Array(128 * 2);

        this.port.onmessage = this.messageProcessor.bind(this);
        this.process = this.process.bind(this);
        this.passThrough = this.passThrough.bind(this);
        this.running = true;
    }

    messageProcessor(event: any) {
        if (event.data.command) {
            const { command, args } = event.data;
            switch (command) {
            case "setTempo":
                this.soundtouch.tempo = args[0];
                this.port.postMessage({
                    status: "OK",
                    args: [command, this.soundtouch.tempo],
                });
                break;

            case "getTempo":
                this.port.postMessage({
                    status: "OK",
                    args: [command, this.soundtouch.tempo],
                });
                break;

            case "setPitch":
                this.soundtouch.pitch = args[0];
                this.port.postMessage({
                    status: "OK",
                    args: [command, this.soundtouch.pitch],
                });
                break;

            case "getPitch":
                this.port.postMessage({
                    status: "OK",
                    args: [command, this.soundtouch.pitch],
                });
                break;

            case "setup":
                this.soundtouch.tempo = args[0];
                this.soundtouch.pitch = args[1];
                this.port.postMessage({
                    status: "OK",
                    args: [command, this.soundtouch.tempo, this.soundtouch.pitch],
                });
                break;

            case "setUpdateInterval":
                this.options.updateInterval = args[0];
                this.port.postMessage({
                    status: "OK",
                    args: [command, this.updateInterval],
                });
                break;

            case "stop":
                this.stop();
                break;

            default:
            }
        }
    }

    async stop() {
        if (!this.running) return;

        this.running = false;

        if (this.filter) {
            this.filter.clear();
            this.recordedSamples = [];
            this.inSamples = new Float32Array();
            this.outSamples = new Float32Array();
        }

        await this.updatePlayingAt();

        try {
            await this.port.postMessage({
                command: "End",
                args: [this.recordedSamples],
            });
        } catch (e) {
            console.error(this.name, e);
        }
    }

    updatePlayingAt() {
        this.port.postMessage({ command: "update", args: [this.playingAt] });
    }

    process(inputs: Float32Array[][], outputs: Float32Array[][], parameters: Record<string, Float32Array>): boolean {
        if (!this.running) return false;

        if (inputs[0].length !== 2) return true;

        if (this.options.bypass) {
            if (this.nVirtualOutputFrames <= this.options.nInputFrames) {
                this.passThrough(inputs[0], outputs[0]);
                this.nVirtualOutputFrames += outputs[0][0].length;
            } else {
                this.stop();
                return false;
            }
        } else {
            if (this.nVirtualOutputFrames <= this.options.nInputFrames) {
                const nOutputFrames = this.processFilter(inputs[0], outputs[0]);
                this.nVirtualOutputFrames += nOutputFrames * this.soundtouch.tempo;
            } else {
                this.stop();
                return false;
            }
        }

        this.playingAt = this.nVirtualOutputFrames / this.options.sampleRate;

        if (this.playingAt - this.lastPlayingAt >= this.options.updateInterval) {
            this.updatePlayingAt();
            this.lastPlayingAt = this.playingAt;
        }

        this.options.nInputFrames += inputs[0].length;

        return true;
    }

    passThrough(inputBuffer: Float32Array[], outputBuffer: Float32Array[]) {
        // input is just left, right array of 128 frames
        const nc = outputBuffer.length; // channel

        for (let channel = 0; channel < nc; channel++) {
            const input = inputBuffer[channel];
            const output = outputBuffer[channel];
            output.set(input);
        }
    }

    processFilter(inputBuffer: Float32Array[], outputBuffer: Float32Array[]) {
        // using soundtouchjs
        // 128 frames (fixed length) for AudioWorkletProcessor

        // input part
        const leftIn = inputBuffer[0];
        const rightIn = inputBuffer[1];
        const left = outputBuffer[0];
        const right = outputBuffer[1];

        const inSamples = this.inSamples; // LR Interleaved for soundtouch

        for (let i = 0; i < inputBuffer[0].length; i++) {
            inSamples[2 * i] = leftIn[i];
            inSamples[2 * i + 1] = rightIn[i];
        }

        this.filter.putSource(inSamples);

        const framesExtracted = this.filter.extract(this.outSamples, 128);

        for (let i = 0; i < framesExtracted; i++) {
            left[i] = this.outSamples[i * 2];
            right[i] = this.outSamples[i * 2 + 1];

            if (isNaN(left[i]) || isNaN(right[i])) {
                left[i] = 0;
                right[i] = 0;
            }
        }

        return framesExtracted;
    }
}

registerProcessor(Constants.WORKLET_NAMES.SOUNDTOUCH, SoundTouchWorkletProcessor);
