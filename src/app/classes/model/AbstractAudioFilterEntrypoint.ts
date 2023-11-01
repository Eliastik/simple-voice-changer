import AbstractAudioFilter from "./AbstractAudioFilter";

export default abstract class AbstractAudioFilterEntrypoint extends AbstractAudioFilter {
    abstract getEntrypointNode(context: BaseAudioContext, buffer: AudioBuffer): AudioFilterNodes;
    abstract getSpeed(): number;

    getNode(context: BaseAudioContext): AudioFilterNodes {
        throw("Methode not implemented");
    }
}