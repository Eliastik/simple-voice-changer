"use client";

import AudioEditorMain from "./audioEditor/AudioEditorMain";
import HomeMenu from "./homeMenu/HomeMenu";
import { useAudioEditor } from "../context/AudioEditorContext";
import ErrorLoadingAudioDialog from "./dialogs/ErrorLoadingAudioDialog";
import LoadingAppDialog from "./dialogs/LoadingAppDialog";
import LoadingAudioFileDialog from "./dialogs/LoadingAudioFileDialog";

const MainComponent = ({ }) => {
  const { audioEditorReady, loadingPrincipalBuffer, downloadingInitialData } = useAudioEditor();

  return (
    <>
      {!audioEditorReady && <HomeMenu></HomeMenu>}
      {audioEditorReady && <AudioEditorMain></AudioEditorMain>}
      {downloadingInitialData && <LoadingAppDialog></LoadingAppDialog>}
      {loadingPrincipalBuffer && <LoadingAudioFileDialog></LoadingAudioFileDialog>}
      <ErrorLoadingAudioDialog></ErrorLoadingAudioDialog>
    </>
  )
};

export default MainComponent;