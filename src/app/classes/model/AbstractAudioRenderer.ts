import AbstractAudioElement from "./AbstractAudioElement";

export default abstract class AbstractAudioRenderer extends AbstractAudioElement {
    abstract renderAudio(context: BaseAudioContext, buffer: AudioBuffer): Promise<AudioBuffer>;
}