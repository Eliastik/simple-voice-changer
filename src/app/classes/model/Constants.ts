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
        SOUNDTOUCH: "worklets/Soundtouch.worklet.js"
    },
    WORKLET_NAMES: {
        BITCRUSHER: "bitcrusher-processor",
        LIMITER: "limiter-processor",
        SOUNDTOUCH: "soundtouch-worklet"
    },
    // Enable or disable the use of Audio Worklet version of Soundtouch
    // If disabled, the ScriptProcessorNode version is used
    ENABLE_SOUNDTOUCH_AUDIO_WORKLET: true,
    ENABLE_AUDIO_WORKLET: true,
    SOUNDTOUCH_PITCH_SHIFTER_BUFFER_SIZE: 16384
};

export default Constants;
