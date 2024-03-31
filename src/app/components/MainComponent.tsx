"use client";

import { useAudioEditor, ErrorProcessingAudio, ErrorDownloadingBufferDialog, ErrorLoadingAudioDialog } from "@eliastik/simple-sound-studio-components";
import { useAudioRecorder } from "../context/AudioRecorderContext";
import AudioEditorMain from "./audioEditor/AudioEditorMain";
import HomeMenu from "./homeMenu/HomeMenu";
import LoadingAppDialog from "./dialogs/LoadingAppDialog";
import LoadingAudioFileDialog from "./dialogs/LoadingAudioFileDialog";
import AudioRecorderMain from "./audioRecorder/AudioRecorderMain";
import AudioRecorderAuthorizationDialog from "./dialogs/AudioRecorderAuthorizationDialog";
import ErrorAuthorizationAudioRecorderDialog from "./dialogs/ErrorAuthorizationAudioRecorderDialog";
import FirstLaunchDialog from "./dialogs/FirstLaunchDialog";
import ErrorRecorderDeviceNotFoundDialog from "./dialogs/ErrorRecorderDeviceNotFoundDialog";
import ErrorRecorderUnknownDialog from "./dialogs/ErrorRecorderUnknownDialog";

const MainComponent = () => {
    const { audioEditorReady, downloadingInitialData } = useAudioEditor();
    const { audioRecorderReady } = useAudioRecorder();

    return (
        <>
            {!audioEditorReady && !audioRecorderReady && <HomeMenu></HomeMenu>}
            {audioEditorReady && <AudioEditorMain></AudioEditorMain>}
            {audioRecorderReady && <AudioRecorderMain></AudioRecorderMain>}
            <LoadingAppDialog></LoadingAppDialog>
            <LoadingAudioFileDialog></LoadingAudioFileDialog>
            <AudioRecorderAuthorizationDialog></AudioRecorderAuthorizationDialog>
            {!downloadingInitialData && <FirstLaunchDialog></FirstLaunchDialog>}
            <ErrorAuthorizationAudioRecorderDialog></ErrorAuthorizationAudioRecorderDialog>
            <ErrorRecorderDeviceNotFoundDialog></ErrorRecorderDeviceNotFoundDialog>
            <ErrorRecorderUnknownDialog></ErrorRecorderUnknownDialog>
            <ErrorLoadingAudioDialog></ErrorLoadingAudioDialog>
            <ErrorDownloadingBufferDialog></ErrorDownloadingBufferDialog>
            <ErrorProcessingAudio></ErrorProcessingAudio>
        </>
    );
};

export default MainComponent;
