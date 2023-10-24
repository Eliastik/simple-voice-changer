import AbstractAudioFilter from "./AbstractAudioFilter";

export default abstract class AbstractAudioFilterEntrypoint extends AbstractAudioFilter {
    abstract getEntrypointNode(context: BaseAudioContext, buffer: AudioBuffer): AudioFilterNodes;

    getNode(context: BaseAudioContext): AudioFilterNodes {
        throw("Methode not implemented");
    }
}