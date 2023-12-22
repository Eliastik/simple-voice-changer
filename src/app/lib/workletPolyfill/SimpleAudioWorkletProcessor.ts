/**
 * This class is the standard AudioWorkletProcessor interface
 */
export interface AudioWorkletProcessorInterface {

    process(inputs: Float32Array[][], outputs: Float32Array[][], parameters: Record<string, Float32Array>): boolean;
    get parameters(): AudioParamMap;
    get parameterDescriptors(): AudioParamMap;
    messageProcessor?: (event: MessageEvent) => void;
}

type ParameterDescriptors = {
    name: string;
    defaultValue: number;
}[];

/**
 * This class is a polyfill for the AudioWorkletProcessor interface
 */
export default class SimpleAudioWorkletProcessor implements AudioWorkletProcessorInterface {
    private _port: MessagePort | null = null;
    messageProcessor?: ((event: MessageEvent) => void) | undefined;

    constructor() {
        const port = new MessageChannel().port1;
        this._port = port;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    process(inputs: Float32Array[][], outputs: Float32Array[][], parameters: Record<string, Float32Array>): boolean {
        return true;
    }

    get port(): MessagePort | null {
        return this._port;
    }

    set port(port: MessagePort | null) {
        if (port) {
            this._port = port;
            port.onmessage = this.onMessage.bind(this);
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    private onMessage(event: MessageEvent): void {
        throw new Error("Method not implemented.");
    }

    get parameters(): AudioParamMap {
        throw new Error("Method not implemented.");
    }

    get parameterDescriptors(): AudioParamMap {
        throw new Error("Method not implemented.");
    }

    getDefaultParameterDescriptors(): ParameterDescriptors {
        return [];
    }
};
