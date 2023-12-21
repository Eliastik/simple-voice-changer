export interface ConfigService {
    /**
     * Get config with a key
     * @param key The key
     */
    getConfig(key: string): string | null;

    /**
     * Set config
     * @param key The key 
     * @param value The config value
     */
    setConfig(key: string, value: string): void;

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
};
