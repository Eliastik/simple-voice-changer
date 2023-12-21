import AbstractAudioElement from "./AbstractAudioElement";
import { AudioFilterNodes } from "../../model/AudioNodes";
import { FilterSettings } from "../../model/filtersSettings/FilterSettings";
import GenericSettingValue from "../../model/filtersSettings/GenericSettingValue";

export default abstract class AbstractAudioFilter extends AbstractAudioElement {

    private defaultSettings: FilterSettings | null = null;

    /** Return a input and output AudioNode of the filter */
    abstract getNode(context: BaseAudioContext): AudioFilterNodes;
    /** Return an object with current settings of this filter */
    abstract getSettings(): FilterSettings;
    /** Set a filter setting */
    abstract setSetting(settingId: string, value: string | GenericSettingValue | undefined): Promise<void>;
    
    /** Get the amount of time this filter add to the audio */
    getAddingTime(): number {
        return 0;
    }

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
        if(this.defaultSettings) {
            Object.keys(this.defaultSettings).forEach(key => {
                if(this.defaultSettings && this.defaultSettings[key]) {
                    this.setSetting(key, this.defaultSettings[key] as (string | GenericSettingValue));
                }
            });
        }
    }

    /** Return if the current filter use an audio worklet */
    public isWorklet() {
        return false;
    }
}
