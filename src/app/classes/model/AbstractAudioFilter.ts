import AbstractAudioElement from "./AbstractAudioElement";

export default abstract class AbstractAudioFilter extends AbstractAudioElement {
    private defaultSettings = {};

    abstract getNode(context: BaseAudioContext): AudioFilterNodes;
    abstract getSettings(): any;
    abstract setSetting(settingId: string, value: string): void;

    public initializeDefaultSettings() {
        this.defaultSettings = this.getSettings();
    }

    public getDefaultSettings() {
        return this.defaultSettings;
    }
}