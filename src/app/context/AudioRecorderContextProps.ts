export default interface AudiRecorderContextProps {
    audioRecorderReady: boolean,
    audioRecorderHasError: boolean,
    initRecorder: () => void,
    audioRecorderAuthorizationPending: boolean,
    closeAudioRecorderError: () => void,
    audioRecording: boolean,
    recordAudio: () => void,
    pauseRecorderAudio: () => void,
    stopRecordAudio: () => void
};