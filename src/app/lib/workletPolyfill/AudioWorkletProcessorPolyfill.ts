import SimpleAudioWorkletProcessor from "./SimpleAudioWorkletProcessor";

if(typeof(window) !== "undefined" && !("AudioWorkletProcessor" in window)) {
    (window as any).AudioWorkletProcessor = SimpleAudioWorkletProcessor;
    (window as any).registerProcessor = () => {};
}