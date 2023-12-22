export default interface SoundtouchWorkletMessage {
    command: string,
    args: (string | number)[],
    status?: string
};
