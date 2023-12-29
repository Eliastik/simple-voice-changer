/* eslint-disable @typescript-eslint/no-explicit-any */
import RegisterProcessorPolyfill from "./RegisterProcessorPolyfill";
import SimpleAudioWorkletProcessor from "./SimpleAudioWorkletProcessor";

if(typeof(window) !== "undefined" && !("AudioWorkletProcessor" in window)) {
    (window as any).AudioWorkletProcessor = SimpleAudioWorkletProcessor;
    (window as any).registerProcessor = RegisterProcessorPolyfill.registerProcessor;
}

if(typeof(global) !== "undefined" && !("AudioWorkletProcessor" in global)) {
    (global as any).AudioWorkletProcessor = SimpleAudioWorkletProcessor;
    (global as any).registerProcessor = RegisterProcessorPolyfill.registerProcessor;
}
