import { AudioFilterNodes } from "../../model/AudioNodes";

export default interface AudioFilterEntrypointInterface {
    /** Return the entrypoint node, with an audio context and an input AudioBuffer */
    getEntrypointNode(context: BaseAudioContext, buffer: AudioBuffer, offline: boolean): Promise<AudioFilterNodes>;
    /** Get the speed of the audio */
    getSpeed(): number;
    /** Update the state of the filter */
    updateState(): void;
};
