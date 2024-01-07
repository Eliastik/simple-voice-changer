import { GenericConfigService, Constants as LibConstants } from "@eliastik/simple-sound-studio-lib";
import Constants from "../model/Constants";
import { UpdateData } from "../model/UpdateData";
import semver from "semver";

export default class ApplicationConfigService extends GenericConfigService {
    getConfig(key: string): string | null {
        const setting = typeof window !== "undefined" ? window.localStorage.getItem(Constants.PREFERENCES_KEYS.PREFIX + key) : null;

        if (!setting) {
            return null;
        }

        return setting;
    }

    setConfig(key: string, value: string): void {
        if (typeof window !== "undefined") {
            window.localStorage.setItem(Constants.PREFERENCES_KEYS.PREFIX + key, value);
        }
    }

    public setCurrentTheme(theme: string) {
        this.setConfig(Constants.PREFERENCES_KEYS.CURRENT_THEME, theme);
    }

    public getCurrentThemePreference(): string {
        return this.getConfig(Constants.PREFERENCES_KEYS.CURRENT_THEME) || Constants.THEMES.AUTO;
    }

    public getCurrentTheme(): string {
        const setting = this.getCurrentThemePreference();

        if (setting == Constants.THEMES.AUTO) {
            return this.getUserThemePreference();
        }

        return setting;
    }

    public setCurrentLanguage(lng: string) {
        this.setConfig(Constants.PREFERENCES_KEYS.CURRENT_LANGUAGE, lng);
    }

    public getCurrentLanguagePreference() {
        const setting = this.getConfig(Constants.PREFERENCES_KEYS.CURRENT_LANGUAGE);

        if (!setting) {
            return this.getUserLanguage().split("-")[0];
        }

        return setting.split("-")[0];
    }

    public hasAlreadyUsedApp() {
        return this.getConfig(Constants.PREFERENCES_KEYS.ALREADY_USED) == "true";
    }

    public setAlreadyUsedApp() {
        this.setConfig(Constants.PREFERENCES_KEYS.ALREADY_USED, "true");
    }

    public enableAudioWorklet(enable: boolean) {
        this.setConfig(LibConstants.PREFERENCES_KEYS.ENABLE_AUDIO_WORKLET, enable ? "true" : "false");
    }

    public enableSoundtouchAudioWorklet(enable: boolean) {
        this.setConfig(LibConstants.PREFERENCES_KEYS.ENABLE_SOUNDTOUCH_AUDIO_WORKLET, enable ? "true" : "false");
    }

    public setBufferSize(value: number) {
        this.setConfig(LibConstants.PREFERENCES_KEYS.BUFFER_SIZE, "" + value);
    }

    public setSampleRate(value: number) {
        this.setConfig(LibConstants.PREFERENCES_KEYS.SAMPLE_RATE, "" + value);
    }

    /** Get current theme from OS (dark/light) */
    private getUserThemePreference(): string {
        if (typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
            return Constants.THEMES.DARK;
        }

        return Constants.THEMES.LIGHT;
    }

    /** Get current user language from browser */
    private getUserLanguage() {
        const found = [];

        if (typeof navigator !== "undefined") {
            if (navigator.languages) {
                for (let i = 0; i < navigator.languages.length; i++) {
                    found.push(navigator.languages[i]);
                }
            }

            if (navigator.language) {
                found.push(navigator.language);
            }
        }

        return found.length > 0 ? found[0] : Constants.DEFAULT_LANGUAGE;
    }

    /** Check for application update */
    public async checkAppUpdate(): Promise<UpdateData | null> {
        const updateData = await fetch(Constants.UPDATER_URI);

        if (updateData) {
            const updateJSON: UpdateData = await updateData.json();

            if (semver.compare(Constants.APP_VERSION, updateJSON.version) === -1) {
                return {
                    ...updateJSON,
                    hasUpdate: true
                };
            }

            return {
                ...updateJSON,
                hasUpdate: false
            };
        }

        return null;
    }
};
