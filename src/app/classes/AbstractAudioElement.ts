export default abstract class AbstractAudioElement {

    private enabled = false;

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
}