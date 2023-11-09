import AbstractAudioFilter from "./AbstractAudioFilter";

export default abstract class AbstractAudioFilterEntrypoint extends AbstractAudioFilter {
    /** Return the entrypoint node, with an audio context and an input AudioBuffer */
    abstract getEntrypointNode(context: BaseAudioContext, buffer: AudioBuffer): AudioFilterNodes;
    /** Get the speed of the audio */
    abstract getSpeed(): number;
    /** Update the state of the filter */
    abstract updateState(): void;

    getNode(context: BaseAudioContext): AudioFilterNodes {
        throw("Methode not implemented");
    }
}