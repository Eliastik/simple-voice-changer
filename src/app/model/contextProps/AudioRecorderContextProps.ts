import { RecorderSettings } from "../../classes/model/RecorderSettings";

export default interface AudiRecorderContextProps {
    audioRecorderReady: boolean,
    audioRecorderHasError: boolean,
    initRecorder: () => void,
    audioRecorderAuthorizationPending: boolean,
    closeAudioRecorderError: () => void,
    audioRecording: boolean,
    recordAudio: () => void,
    pauseRecorderAudio: () => void,
    stopRecordAudio: () => void,
    recorderDisplayTime: string,
    exitAudioRecorder: () => void,
    recorderTime: number,
    recorderSettings: RecorderSettings,
    changeInput: (deviceId: string, groupId: string | undefined) => void
};