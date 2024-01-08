"use client";

import AudioEditorMain from "./audioEditor/AudioEditorMain";
import HomeMenu from "./homeMenu/HomeMenu";
import { useAudioEditor } from "@eliastik/simple-sound-studio-components/lib";
import ErrorLoadingAudioDialog from "./dialogs/ErrorLoadingAudioDialog";
import LoadingAppDialog from "./dialogs/LoadingAppDialog";
import LoadingAudioFileDialog from "./dialogs/LoadingAudioFileDialog";
import AudioRecorderMain from "./audioRecorder/AudioRecorderMain";
import { useAudioRecorder } from "../context/AudioRecorderContext";
import AudioRecorderAuthorizationDialog from "./dialogs/AudioRecorderAuthorizationDialog";
import ErrorAuthorizationAudioRecorderDialog from "./dialogs/ErrorAuthorizationAudioRecorderDialog";
import ErrorDownloadingBufferDialog from "./dialogs/ErrorDownloadingBufferDialog";
import FirstLaunchDialog from "./dialogs/FirstLaunchDialog";
import ErrorProcessingAudio from "./dialogs/ErrorProcessingAudio";

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
            <ErrorLoadingAudioDialog></ErrorLoadingAudioDialog>
            <ErrorDownloadingBufferDialog></ErrorDownloadingBufferDialog>
            <ErrorProcessingAudio></ErrorProcessingAudio>
        </>
    );
};

export default MainComponent;
