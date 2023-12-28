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
    private messageChannel: MessageChannel | null = null;
    messageProcessor?: ((event: MessageEvent) => void) | undefined;

    constructor() {
        this.messageChannel = new MessageChannel();
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    process(inputs: Float32Array[][], outputs: Float32Array[][], parameters: Record<string, Float32Array>): boolean {
        return true;
    }

    get port(): MessagePort | null {
        return this.messageChannel && this.messageChannel.port1;
    }

    get port2(): MessagePort | null {
        return this.messageChannel && this.messageChannel.port2;
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
