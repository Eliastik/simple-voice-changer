import SimpleAudioWorkletProcessor from "./SimpleAudioWorkletProcessor";
import AudioParamPolyfill from "./AudioParamPolyfill";
import Functions from "../utils/Functions";

/**
 * This class convert an audio worklet processor node to a script processor node
 * automagically. Highly experimental, and might not work with some WorkletProcessor
 */
export default class WorkletScriptProcessorNodeAdapter {

    private workletProcessor: SimpleAudioWorkletProcessor;
    private _parameters = new Map<string, AudioParamPolyfill>();
    private _port: MessagePort | null = null;
    private _scriptProcessorNode: ScriptProcessorNode | null;
    private currentContext: BaseAudioContext | null = null;

    constructor(context: BaseAudioContext, node: SimpleAudioWorkletProcessor, bufferSize?: number) {
        this.workletProcessor = node;
        this.currentContext = context;

        // Create a ScriptProcessorNode with the same number of input and output channels
        this._scriptProcessorNode = context.createScriptProcessor(
            bufferSize,
            2,
            2
        );

        this.setupPort();
        this.setupProcessor();
        this.setupWorkletScope(context);
    }

    private setupPort(): void {
        const messageChannel = new MessageChannel();

        messageChannel.port1.onmessage = (ev) => {
            if(this.workletProcessor && this.workletProcessor.port2) {
                this.workletProcessor.port2.postMessage(ev.data);
            }
        };

        this._port = messageChannel.port2;
    }

    private setupProcessor() {
        if(!this._scriptProcessorNode) {
            return;
        }

        this._scriptProcessorNode.onaudioprocess = (ev: AudioProcessingEvent) => {
            if(this.workletProcessor) {
                const inputArray = [Functions.convertAudioBufferToFloat32Array(ev.inputBuffer)];
                const ouputArray = [Functions.convertAudioBufferToFloat32Array(ev.outputBuffer)];

                const records: [string, Float32Array][] = [];

                for (const [key, value] of this._parameters.entries()) {
                    records.push([key, Functions.convertAudioParamToFloat32Array(value, 1)]);
                }

                const recordsMap: Record<string, Float32Array> = Object.fromEntries(records);
                
                this.workletProcessor.process(inputArray, ouputArray, recordsMap);
            }
        };

        const descriptors = this.workletProcessor.defaultParameterDescriptors;

        if(descriptors) {
            descriptors.forEach(descriptor => {
                if(this.currentContext) {
                    this._parameters.set(descriptor.name, new AudioParamPolyfill(this.currentContext, descriptor.defaultValue));
                }
            });
        }
    }

    private setupWorkletScope(context: BaseAudioContext) {
        if(typeof(window) !== "undefined") {
            window.sampleRate = context.sampleRate;
        }
    }

    get port() {
        return this._port;
    }

    get parameters(): AudioParamMap {
        return this._parameters;
    }

    get node() {
        return this._scriptProcessorNode;
    }

    get context() {
        return this._scriptProcessorNode?.context;
    }
}
