import AbstractAudioFilter from "./AbstractAudioFilter";

export default abstract class AbstractAudioFilterWorklet extends AbstractAudioFilter {

    abstract initializeWorklet(audioContext: BaseAudioContext): Promise<void>;

    public isWorklet(): boolean {
        return true;
    }
}