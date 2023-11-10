export default interface AudiRecorderContextProps {
    audioRecorderReady: boolean,
    audioRecorderHasError: boolean,
    initRecorder: () => void,
    audioRecorderAuthorizationPending: boolean,
    closeAudioRecorderError: () => void
};