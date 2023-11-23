const Constants = {
    COMPATIBILITY_MODE_ENABLED: "compatibility-mode-enabled",
    COMPATIBILITY_MODE_CHECKED: "compatibility-mode-checked",
    AUDIO_EDITOR: "audioEditor",
    EXPORT_WAV_COMMAND: "exportWAV",
    AUDIO_WAV: "audio/wav",
    RECORD_COMMAND: "record",
    INIT_COMMAND: "init",
    FILTERS_NAMES: {
        REVERB: "reverb",
        ECHO: "echo",
        BASS_BOOST: "bassboost",
        BITCRUSHER: "bitcrusher",
        HIGH_PASS: "highpass",
        LIMITER: "limiter",
        LOW_PASS: "lowpass",
        PASS_THROUGH: "passthroughfilter",
        RETURN_AUDIO: "returnAudio",
        SOUNDTOUCH: "soundtouch",
        TELEPHONIZER: "telephonizer",
        VOCODER: "vocoder"
    },
    WORKLET_PATHS: {
        BITCRUSHER: "worklets/BitCrusher.worklet.js",
        LIMITER: "worklets/Limiter.worklet.js",
        SOUNDTOUCH: "worklets/scheduled-soundtouch-worklet.js"
    }
};

export default Constants;