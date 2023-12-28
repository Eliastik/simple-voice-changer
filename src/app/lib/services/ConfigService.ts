export interface ConfigService {
    /**
     * Get config with a key
     * @param key The key
     */
    getConfig(key: string): string | undefined | null;

    /**
     * Set config
     * @param key The key 
     * @param value The config value
     */
    setConfig(key: string, value: string): void;

    /**
     * Check if the compatibility/direct audio rendering mode is enabled
     */
    isCompatibilityModeEnabled(): boolean;

    /**
     * Was compatibility/direct audio rendering mode already checked for auto enabling? (if an error occurs rendering in offline context)
     */
    isCompatibilityModeChecked(): boolean;

    /**
     * Check if AudioWorklet is enabled for the filters
     */
    isAudioWorkletEnabled(): boolean;

    /** 
     * Check if AudioWorklet mode is enabled for Soundtouch
     */
    isSoundtouchAudioWorkletEnabled(): boolean;

    /**
     * Get buffer size setting
     */
    getBufferSize(): number;

    /**
     * Get sample rate, or 0 for auto
     */
    getSampleRate(): number;

    /**
     * Enable the compatibility/direct audio rendering mode
     */
    enableCompatibilityMode(): void;

    /**
     * Disable the compatibility/direct audio rendering mode
     */
    disableCompatibilityMode(): void;
};
