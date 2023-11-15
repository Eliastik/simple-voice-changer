export abstract class ConfigService {
    /**
     * Get config with a key
     * @param key The key
     */
    abstract getConfig(key: string): string | null;

    /**
     * Set config
     * @param key The key 
     * @param value The config value
     */
    abstract setConfig(key: string, value: string): void;
}