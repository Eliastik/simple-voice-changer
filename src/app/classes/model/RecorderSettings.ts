import AudioConstraint from "./AudioConstraint";

export interface RecorderSettings {
    deviceList: MediaDeviceInfo[],
    constraints: AudioConstraint,
    audioFeedback: boolean
}