let indexes = {
    BitCrusherProcessor: class BitCrusherProcessor {},
    LimiterProcessor: class LimiterProcessor {},
    SoundTouchWorkletProcessor: class SoundTouchWorkletProcessor {}
};

if(typeof(window) !== "undefined") {
    indexes = {
        BitCrusherProcessor: require("./BitCrusher.worklet").default,
        LimiterProcessor: require("./Limiter.worklet").default,
        SoundTouchWorkletProcessor: require("./Soundtouch.worklet").default
    };
}

export default indexes;
