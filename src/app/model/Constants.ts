const Constants = {
    APP_NAME: "Simple Voice Changer",
    APP_BY: "By Eliastik's Softs",
    DEFAULT_LANGUAGE: "en",
    FILES_DOWNLOAD_NAME: "simple_voice_changer",
    APP_VERSION: "2.2.1",
    APP_VERSION_DATE: "9/10/2024",
    UPDATER_URI: process.env.NEXT_PUBLIC_UPDATER_URI || "https://www.eliastiksofts.com/simple-voice-changer/update.json",
    OFFICIAL_WEBSITE: "https://www.eliastiksofts.com/simple-voice-changer/",
    SOURCE_CODE: "https://github.com/Eliastik/simple-voice-changer",
    APP_LICENSE: "GNU GPL v3",
    RELEASE_LINK: "https://github.com/Eliastik/simple-voice-changer/releases/tag/2.2.1",
    AUDIO_BUFFERS_TO_FETCH: ["impulse_response.wav","modulator.mp3"],
    SERVICE_WORKER_SCOPE: process.env.NEXT_PUBLIC_BASE_PATH || "",
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
