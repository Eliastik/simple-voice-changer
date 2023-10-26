export default class ApplicationConfigService {
    public setCurrentTheme(theme: string) {
        localStorage.setItem("simplevoicechanger-current-theme", theme);
    }

    public getCurrentThemePreference(): string {
        const setting = localStorage.getItem("simplevoicechanger-current-theme");

        if(!setting || setting == "auto") {
            return "auto";
        }

        return setting;
    }

    public getCurrentTheme(): string {
        const setting = this.getCurrentThemePreference();

        if(setting == "auto") {
            return this.getUserThemePreference();
        }

        return setting;
    }

    private getUserThemePreference(): string {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return "dark";
        }

        return "light";
    }
}