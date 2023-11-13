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

const MainComponent = ({ }) => {
  const { audioEditorReady, loadingPrincipalBuffer, downloadingInitialData } = useAudioEditor();
  const { audioRecorderReady, audioRecorderAuthorizationPending } = useAudioRecorder();

  return (
    <>
      {!audioEditorReady && !audioRecorderReady && <HomeMenu></HomeMenu>}
      {audioEditorReady && <AudioEditorMain></AudioEditorMain>}
      {audioRecorderReady && <AudioRecorderMain></AudioRecorderMain>}
      {downloadingInitialData && <LoadingAppDialog></LoadingAppDialog>}
      {loadingPrincipalBuffer && <LoadingAudioFileDialog></LoadingAudioFileDialog>}
      {audioRecorderAuthorizationPending && <AudioRecorderAuthorizationDialog></AudioRecorderAuthorizationDialog>}
      <ErrorAuthorizationAudioRecorderDialog></ErrorAuthorizationAudioRecorderDialog>
      <ErrorLoadingAudioDialog></ErrorLoadingAudioDialog>
      <ErrorDownloadingBufferDialog></ErrorDownloadingBufferDialog>
    </>
  )
};

export default MainComponent;