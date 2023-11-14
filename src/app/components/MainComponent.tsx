"use client";

import AudioEditorMain from "./audioEditor/AudioEditorMain";
import HomeMenu from "./homeMenu/HomeMenu";
import { useAudioEditor } from "../context/AudioEditorContext";
import ErrorLoadingAudioDialog from "./dialogs/ErrorLoadingAudioDialog";
import LoadingAppDialog from "./dialogs/LoadingAppDialog";
import LoadingAudioFileDialog from "./dialogs/LoadingAudioFileDialog";
import AudioRecorderMain from "./audioRecorder/AudioRecorderMain";
import { useAudioRecorder } from "../context/AudioRecorderContext";
import AudioRecorderAuthorizationDialog from "./dialogs/AudioRecorderAuthorizationDialog";
import ErrorAuthorizationAudioRecorderDialog from "./dialogs/ErrorAuthorizationAudioRecorderDialog";
import ErrorDownloadingBufferDialog from "./dialogs/ErrorDownloadingBufferDialog";
import FirstLaunchDialog from "./dialogs/FirstLaunchDialog";

const MainComponent = ({ }) => {
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
    </>
  )
};

export default MainComponent;