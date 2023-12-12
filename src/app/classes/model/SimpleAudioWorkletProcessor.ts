export interface AudioWorkletProcessorInterface {

    process(inputs: Float32Array[][], outputs: Float32Array[][], parameters: Record<string, Float32Array>): boolean;
    get parameters(): AudioParamMap;
    get parameterDescriptors(): AudioParamMap;
    messageProcessor?: (event: any) => void;
}

type ParameterDescriptors = {
    name: string;
    defaultValue: number;
}[];

export default class SimpleAudioWorkletProcessor implements AudioWorkletProcessorInterface {
    private _port: MessagePort | null = null;
    messageProcessor?: ((event: any) => void) | undefined;

    constructor() {
        const port = new MessageChannel().port1;
        this._port = port;
    }

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
