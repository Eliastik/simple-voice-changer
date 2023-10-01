export default abstract class AbstractAudioFilter {
    abstract render(): JSX.Element;
    abstract getNode(context: AudioContext): AudioFilterNodes;
}