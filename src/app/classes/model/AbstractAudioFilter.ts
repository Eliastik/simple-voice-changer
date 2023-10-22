import AbstractAudioElement from "./AbstractAudioElement";

export default abstract class AbstractAudioFilter extends AbstractAudioElement {
    private defaultSettings: any;

    abstract getNode(context: BaseAudioContext): AudioFilterNodes;
    abstract getSettings(): any;
    abstract setSetting(settingId: string, value: string): void;

    public initializeDefaultSettings() {
        this.defaultSettings = this.getSettings();
    }

    public getDefaultSettings() {
        return this.defaultSettings;
    }

    public resetSettings() {
        Object.keys(this.defaultSettings).forEach(key => {
            this.setSetting(key, this.defaultSettings[key]);
        });
    }
}