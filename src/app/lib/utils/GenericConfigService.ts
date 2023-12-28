import Constants from "../model/Constants";
import { ConfigService } from "../services/ConfigService";

/**
 * Default implementation for a ConfigService, using a built-in map.
 * The configuration is not stored in localstorage in this case.
 */
export default class GenericConfigService implements ConfigService {

    private mapConfig = new Map<string, string>();

    getConfig(key: string): string | undefined | null {
        return this.mapConfig.get(key);
    }

    setConfig(key: string, value: string): void {
        this.mapConfig.set(key, value);
    }

    isCompatibilityModeEnabled(): boolean {
        return this.getConfig(Constants.PREFERENCES_KEYS.COMPATIBILITY_MODE_ENABLED) == "true";
    }

    isCompatibilityModeChecked(): boolean {
        return this.getConfig(Constants.PREFERENCES_KEYS.COMPATIBILITY_MODE_CHECKED) == "true";
    }

    isAudioWorkletEnabled(): boolean {
        const setting = this.getConfig(Constants.PREFERENCES_KEYS.ENABLE_AUDIO_WORKLET);

        if(setting != null) {
            return setting == "true";
        }

        return Constants.ENABLE_AUDIO_WORKLET;
    }

    isSoundtouchAudioWorkletEnabled(): boolean {
        const setting = this.getConfig(Constants.PREFERENCES_KEYS.ENABLE_SOUNDTOUCH_AUDIO_WORKLET);

        if(setting != null) {
            return setting == "true";
        }

        return Constants.ENABLE_SOUNDTOUCH_AUDIO_WORKLET;
    }

    getBufferSize(): number {
        const setting = this.getConfig(Constants.PREFERENCES_KEYS.BUFFER_SIZE);

        if(setting != null) {
            return parseInt(setting);
        }

        return Constants.DEFAULT_BUFFER_SIZE;
    }

    getSampleRate(): number {
        const setting = this.getConfig(Constants.PREFERENCES_KEYS.SAMPLE_RATE);

        if(setting != null) {
            return parseInt(setting);
        }

        return Constants.DEFAULT_SAMPLE_RATE;
    }

    enableCompatibilityMode() {
        this.setConfig(Constants.PREFERENCES_KEYS.COMPATIBILITY_MODE_ENABLED, "true");
    }

    disableCompatibilityMode() {
        this.setConfig(Constants.PREFERENCES_KEYS.COMPATIBILITY_MODE_ENABLED, "false");
    }
};
