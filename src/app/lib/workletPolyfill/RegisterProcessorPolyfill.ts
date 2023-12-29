import SimpleAudioWorkletProcessor from "./SimpleAudioWorkletProcessor";

/**
 * Polyfill for registerProcessor method used in AudioWorklets
 */
export default class RegisterProcessorPolyfill {

    private static processorsMap = new Map<string, typeof SimpleAudioWorkletProcessor>();

    static registerProcessor(processorName: string, processorClass: typeof SimpleAudioWorkletProcessor) {
        RegisterProcessorPolyfill.processorsMap.set(processorName, processorClass);
    }

    static getProcessor(processorName: string): SimpleAudioWorkletProcessor | null {
        const processor = RegisterProcessorPolyfill.processorsMap.get(processorName);

        if(processor) {
            return new processor();
        }

        return null;
    }
};
