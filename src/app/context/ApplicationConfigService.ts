import { ConfigService } from "../classes/model/ConfigService";
import Constants from "../model/Constants";
import { UpdateData } from "../model/UpdateData";
import semver from "semver";

export default class ApplicationConfigService extends ConfigService {
    public setCurrentTheme(theme: string) {
        this.setConfig("current-theme", theme);
    }

    public getCurrentThemePreference(): string {
        return this.getConfig("current-theme") || "auto";
    }

    public getCurrentTheme(): string {
        const setting = this.getCurrentThemePreference();

        if (setting == "auto") {
            return this.getUserThemePreference();
        }

        return setting;
    }

    public setCurrentLanguage(lng: string) {
        this.setConfig("current-language", lng);
    }

    public getCurrentLanguagePreference() {
        const setting = this.getConfig("current-language");

        if (!setting) {
            return this.getUserLanguage().split("-")[0];
        }

        return setting.split("-")[0];
    }

    public hasAlreadyUsedApp() {
        return this.getConfig("already-used") == "true";
    }

    public setAlreadyUsedApp() {
        this.setConfig("already-used", "true");
    }

    getConfig(key: string): string | null {
        const setting = typeof window !== "undefined" ? window.localStorage.getItem("simplevoicechanger-" + key) : null;

        if (!setting) {
            return null;
        }

        return setting;
    }

    setConfig(key: string, value: string): void {
        if (typeof window !== "undefined") {
            window.localStorage.setItem("simplevoicechanger-" + key, value);
        }
    }

    /** Get current theme from OS (dark/light) */
    private getUserThemePreference(): string {
        if (typeof window !== "undefined" && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return "dark";
        }

        return "light";
    }

    /** Get current user language from browser */
    private getUserLanguage() {
        const found = [];

        if (typeof navigator !== 'undefined') {
            if (navigator.languages) {
                for (let i = 0; i < navigator.languages.length; i++) {
                    found.push(navigator.languages[i]);
                }
            }

            if (navigator.language) {
                found.push(navigator.language);
            }
        }

        return found.length > 0 ? found[0] : "en";
    }

    /** Check for application update */
    public async checkAppUpdate(): Promise<UpdateData | null> {
        const updateData = await fetch(Constants.updater_uri);

        if (updateData) {
            const updateJSON: UpdateData = await updateData.json();

            if (semver.compare(Constants.app_version, updateJSON.version) === -1) {
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
}