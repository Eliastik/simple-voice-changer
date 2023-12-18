const Constants = {
    DEFAULT_LANGUAGE: "en",
    FILES_DOWNLOAD_NAME: "simple_voice_changer",
    APP_VERSION: "2.1.0",
    APP_VERSION_DATE: "12/19/2023",
    UPDATER_URI: "https://www.eliastiksofts.com/simple-voice-changer/update.json",
    OFFICIAL_WEBSITE: "https://www.eliastiksofts.com/simple-voice-changer/",
    SOURCE_CODE: "https://github.com/Eliastik/simple-voice-changer",
    APP_LICENSE: "GNU GPL v3",
    RELEASE_LINK: "https://github.com/Eliastik/simple-voice-changer/releases/tag/2.0",
    AUDIO_BUFFERS_TO_FETCH: ["static/sounds/impulse_response.wav","static/sounds/modulator.mp3"],
    SERVICE_WORKER_SCOPE: "/simple-voice-changer/demo/", // Same as from .env.prod
    PREFERENCES_KEYS: {
        CURRENT_THEME: "current-theme",
        CURRENT_LANGUAGE: "current-language",
        ALREADY_USED: "already-used",
        PREFIX: "simplevoicechanger-"
    },
    THEMES: {
        AUTO: "auto",
        DARK: "dark",
        LIGHT: "light"
    }
};

export default Constants;
