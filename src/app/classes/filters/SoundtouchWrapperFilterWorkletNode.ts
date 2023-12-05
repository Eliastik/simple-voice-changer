let soundtouchWrapperFilterWorkletNodeClass: any;

if(typeof(window) !== "undefined") {
    soundtouchWrapperFilterWorkletNodeClass = class SoundtouchWrapperFilterWorkletNode extends AudioWorkletNode {

        name: string = "";
        running = false;
        _tempo = 1;
        _pitch = 1;

        constructor(context: BaseAudioContext, workletName: string, options: any, pitch: number, tempo: number) {
            super(context, workletName, options);

            this.name = this.constructor.name;
            this.port.onmessage = this.messageProcessor.bind(this);
            this.running = true;
            this.tempo = tempo;
            this.pitch = pitch;
            this.updateInterval = options.processorOptions.updateInterval;
        }

        set updateInterval(value: number) {
            this.port.postMessage({ command: "updateInterval", args: [value] });
        }

        get node() {
            return this;
        }

        set tempo(value: number) {
            this.port.postMessage({ command: "setTempo", args: [value] });
        }

        set pitch(value: number) {
            this.port.postMessage({ command: "setPitch", args: [value] });
        }

        get tempo(): number {
            this.port.postMessage({ command: "getTempo", args: [] });
            return this._tempo;
        }

        get pitch(): number {
            this.port.postMessage({ command: "getPitch", args: [] });
            return this._pitch;
        }

        async stop() {
            if (!this.running) return;

            this.port.postMessage({ command: "stop", args: [] });
            this.disconnect();

            this.running = false;
        }

        messageProcessor(e: any) {
            if (e.data.command) {
                const { command } = e.data;
                
                switch (command) {
                case "End":
                    this.stop();
                    break;
                default:
                    break;
                }

                if (e.data.status) {
                    const value = e.data.args[1];

                    switch (e.data.args[0]) {
                    case "getTempo":
                        this._tempo = value;
                        break;
                    case "getPitch":
                        this._pitch = value;
                        break;
                    default:
                        break;
                    }
                    return;
                }
            }
        }
    };
}

export default soundtouchWrapperFilterWorkletNodeClass;
