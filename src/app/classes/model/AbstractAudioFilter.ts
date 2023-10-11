import AbstractAudioElement from "./AbstractAudioElement";

export default abstract class AbstractAudioFilter extends AbstractAudioElement {
    abstract getNode(context: BaseAudioContext): AudioFilterNodes;
    abstract getSettings(): any;
    abstract setSetting(settingId: string, value: string): void;
}