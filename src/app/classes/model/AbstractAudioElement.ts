import BufferFetcherService from "../BufferFetcherService";

export default abstract class AbstractAudioElement {

    private enabled = false;
    bufferFetcherService: BufferFetcherService | undefined;

    abstract getOrder(): number;

    isEnabled(): boolean {
        return this.enabled;
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