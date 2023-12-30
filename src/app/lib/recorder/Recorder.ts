import { RecorderCallback, RecorderCallbacks } from "../model/RecorderCallback";
import RecorderConfig from "../model/RecorderConfig";
import RecorderWorkerMessage from "../model/RecorderWorkerMessage";
import getRecorderWorker from "./RecorderWorker";

export class Recorder {

    // Inline Worker
    private worker: Worker | null = null;
    private node: ScriptProcessorNode | null = null;
    private context: BaseAudioContext | null = null;

    config: RecorderConfig = {
        bufferLen: 4096,
        sampleRate: 44100,
        numChannels: 2,
        mimeType: "audio/wav",
        callback: () => { }
    };

    recording = false;

    callbacks: RecorderCallbacks = {
        getBuffer: [],
        exportWAV: []
    };

    constructor(source: AudioNode, cfg: RecorderConfig) {
        Object.assign(this.config, cfg);
        this.setup(source);

        if (this.context) {
            this.worker = getRecorderWorker();

            if (this.worker) {
                this.worker.postMessage({
                    command: "init",
                    config: {
                        sampleRate: this.context.sampleRate,
                        numChannels: this.config.numChannels
                    }
                });

                this.worker.onmessage = (e: RecorderWorkerMessage) => {
                    let callbacks = null;

                    switch (e.data.command) {
                    case "getBuffer":
                        callbacks = this.callbacks.getBuffer;
                        break;
                    case "exportWAV":
                        callbacks = this.callbacks.exportWAV;
                        break;
                    }

                    if (callbacks) {
                        const cb = callbacks.pop();
                        if (typeof cb == "function") {
                            (cb as RecorderCallback<Blob | Float32Array[]>)(e.data.data);
                        }
                    }
                };
            }
        }
    }

    setup(source: AudioNode) {
        if (this.node) { // Disconnect previous node
            this.node.disconnect();
        }

        if (source) {
            this.context = source.context;

            if (this.context) {
                this.node = (this.context.createScriptProcessor).call(this.context,
                    this.config.bufferLen, this.config.numChannels, this.config.numChannels);

                this.node.onaudioprocess = (e) => {
                    if (!this.recording) return;

                    const buffer = [];
                    for (let channel = 0; channel < this.config.numChannels; channel++) {
                        buffer.push(e.inputBuffer.getChannelData(channel));
                    }

                    if (this.worker) {
                        this.worker.postMessage({
                            command: "record",
                            buffer: buffer
                        });
                    }
                };

                source.connect(this.node);
                this.node.connect(this.context.destination);    //this should not be necessary
            }
        }
    }


    record() {
        this.recording = true;
    }

    stop() {
        this.recording = false;
    }

    clear() {
        if (this.worker) {
            this.worker.postMessage({ command: "clear" });
        }
    }

    getBuffer(cb: RecorderCallback<Float32Array[]>) {
        cb = cb || this.config.callback;
        if (!cb) throw new Error("Callback not set");

        this.callbacks.getBuffer.push(cb);

        if (this.worker) {
            this.worker.postMessage({ command: "getBuffer" });
        }
    }

    exportWAV(cb: RecorderCallback<Blob>, mimeType?: string) {
        mimeType = mimeType || this.config.mimeType;
        cb = cb || this.config.callback;
        if (!cb) throw new Error("Callback not set");

        this.callbacks.exportWAV.push(cb);

        if (this.worker) {
            this.worker.postMessage({
                command: "exportWAV",
                type: mimeType
            });
        }
    }

    static forceDownload(blob: Blob, filename: string) {
        const link = window.document.createElement("a");
        const url = (window.URL || window.webkitURL).createObjectURL(blob);
        window.document.body.appendChild(link);
        link.href = url;
        link.download = filename || "output.wav";
        link.click();
        window.URL.revokeObjectURL(url);
    }
};

export default Recorder;
