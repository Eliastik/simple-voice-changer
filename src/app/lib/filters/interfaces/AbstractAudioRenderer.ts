import AbstractAudioElement from "./AbstractAudioElement";

export default abstract class AbstractAudioRenderer extends AbstractAudioElement {
    /** Render an AudioBuffer based on another input AudioBuffer */
    abstract renderAudio(context: BaseAudioContext, buffer: AudioBuffer): Promise<AudioBuffer>;
}