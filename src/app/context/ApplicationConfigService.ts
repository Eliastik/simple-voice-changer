import Constants from "../model/Constants";
import { UpdateData } from "../model/UpdateData";
import semver from "semver";

export default class ApplicationConfigService {
    public setCurrentTheme(theme: string) {
        if (typeof window !== "undefined") {
            window.localStorage.setItem("simplevoicechanger-current-theme", theme);
        }
    }

    public getCurrentThemePreference(): string {
        const setting = typeof window !== "undefined" ? window.localStorage.getItem("simplevoicechanger-current-theme") : "auto";

        if (!setting || setting == "auto") {
            return "auto";
        }

        return setting;
    }

    public getCurrentTheme(): string {
        const setting = this.getCurrentThemePreference();

        if (setting == "auto") {
            return this.getUserThemePreference();
        }

        return setting;
    }

    private getUserThemePreference(): string {
        if (typeof window !== "undefined" && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return "dark";
        }

        return "light";
    }

    public setCurrentLanguage(lng: string) {
        if (typeof window !== "undefined") {
            window.localStorage.setItem("simplevoicechanger-current-language", lng);
        }
    }

    public getCurrentLanguagePreference() {
        const setting = typeof window !== "undefined" ? window.localStorage.getItem("simplevoicechanger-current-language") : null;

        if (!setting) {
            return this.getUserLanguage().split("-")[0];
        }

        return setting.split("-")[0];
    }

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

    public async checkAppUpdate(): Promise<UpdateData | null> {
        const updateData = await fetch(Constants.updater_uri);

        if(updateData) {
            const updateJSON: UpdateData = await updateData.json();

            if(semver.compare(Constants.app_version, updateJSON.version) === -1) {
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