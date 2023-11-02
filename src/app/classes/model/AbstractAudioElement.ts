import BufferFetcherService from "../BufferFetcherService";

export default abstract class AbstractAudioElement {

    private enabled = false;
    private defaultEnabled = false;
    bufferFetcherService: BufferFetcherService | undefined;

    abstract getOrder(): number;

    isEnabled(): boolean {
        return this.enabled;
    }
    
    isDefaultEnabled(): boolean {
        return this.defaultEnabled;
    }

    setDefaultEnabled(state: boolean) {
        this.defaultEnabled = state;
    }

    enable() {
        this.enabled = true;
    }

    disable() {
        this.enabled = false;
    }

    toggle() {
        this.enabled = !this.enabled;
    }

    abstract getId(): string;
}