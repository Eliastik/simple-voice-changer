import SimpleAudioWorkletProcessor from "../model/SimpleAudioWorkletProcessor";
import AudioParamPolyfill from "./AudioParamPolyfilL";
import Functions from "./Functions";

/**
 * This class convert an audio worklet processor node to a script processor node
 * automagically
 */
export default class WorkletScriptProcessorNodeAdapter {

    private workletProcessor: SimpleAudioWorkletProcessor;
    private _parameters = new Map<string, AudioParamPolyfill>();
    private _port: MessagePort | null = null;
    private _scriptProcessorNode: ScriptProcessorNode | null;
    private currentContext: BaseAudioContext | null = null;

    constructor(context: BaseAudioContext, node: SimpleAudioWorkletProcessor) {
        this.workletProcessor = node;
        this.currentContext = context;

        // Create a ScriptProcessorNode with the same number of input and output channels
        this._scriptProcessorNode = context.createScriptProcessor(
            0,
            2,
            2
        );

        this.setupPort();
        this.setupProcessor();
    }

    private setupPort(): void {
        const port = new MessageChannel().port1;

        port.onmessage = (ev) => {
            if(this.workletProcessor && this.workletProcessor.port) {
                this.workletProcessor.port.postMessage(ev.data);
            }
        };

        this._port = port;
    }

    private setupProcessor() {
        if(!this._scriptProcessorNode) {
            return;
        }

        this._scriptProcessorNode.onaudioprocess = (ev: AudioProcessingEvent) => {
            if(this.workletProcessor) {
                const inputArray = [Functions.convertAudioBufferToFloat32Array(ev.inputBuffer)];
                const ouputArray = [Functions.convertAudioBufferToFloat32Array(ev.outputBuffer)];

                const records: Record<string, Float32Array> = {};

                for(const key of this._parameters.keys()) {
                    const value = this.parameters.get(key);

                    if(value) {
                        records[key] = Functions.convertAudioParamToFloat32Array(value, 1);
                    }
                }
                console.log(records);
                
                this.workletProcessor.process(inputArray, ouputArray, records);
            }
        };

        const descriptors = this.workletProcessor.getDefaultParameterDescriptors();

        if(descriptors) {
            descriptors.forEach(descriptor => {
                if(this.currentContext) {
                    this._parameters.set(descriptor.name, new AudioParamPolyfill(this.currentContext, descriptor.defaultValue));
                }
            });
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
}
