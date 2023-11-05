import BufferFetcherService from "../BufferFetcherService";

export default abstract class AbstractAudioElement {

    private enabled = false;
    private defaultEnabled = false;
    bufferFetcherService: BufferFetcherService | undefined;

    /** Returns the order in which the filter/renderer needs to be applied */
    abstract getOrder(): number;

    /** Is this filter/renderer enabled? */
    isEnabled(): boolean {
        return this.enabled;
    }

    /** Is this filter/renderer enabled by default? */
    isDefaultEnabled(): boolean {
        return this.defaultEnabled;
    }

    /** Set to true if this filter/renderer needs to be enabled by default */
    setDefaultEnabled(state: boolean) {
        this.defaultEnabled = state;
    }

    /** Enable this filter/renderer */
    enable() {
        this.enabled = true;
    }

    /** Disable this filter/renderer */
    disable() {
        this.enabled = false;
    }

    /** Toggle to enabled/disabled this filter */
    toggle() {
        this.enabled = !this.enabled;
    }

    /** Returns the id of this filter/renderer */
    abstract getId(): string;
}