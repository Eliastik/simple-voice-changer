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
}