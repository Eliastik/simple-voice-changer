import AbstractAudioElement from "./AbstractAudioElement";

export default abstract class AbstractAudioFilterEntrypoint extends AbstractAudioElement {
    abstract getNode(context: BaseAudioContext, buffer: AudioBuffer): AudioFilterNodes;
}