import AbstractAudioElement from "./AbstractAudioElement";
import { AudioFilterNodes } from "./AudioNodes";

export default abstract class AbstractAudioFilter extends AbstractAudioElement {
    private defaultSettings: any;

    /** Return a input and output AudioNode of the filter */
    abstract getNode(context: BaseAudioContext): AudioFilterNodes;
    /** Return an object with current settings of this filter */
    abstract getSettings(): any;
    /** Set a filter setting */
    abstract setSetting(settingId: string, value: string): Promise<void>;

    /** Store the default settings */
    public initializeDefaultSettings() {
        this.defaultSettings = this.getSettings();
    }

    /** Returns the default settings of this filter */
    public getDefaultSettings() {
        return this.defaultSettings;
    }

    /** Reset the default settings of this filter */
    public resetSettings() {
        Object.keys(this.defaultSettings).forEach(key => {
            this.setSetting(key, this.defaultSettings[key]);
        });
    }

    public isWorklet() {
        return false;
    }
}