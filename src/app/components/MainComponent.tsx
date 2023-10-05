"use client";

import AudioEditorMain from "./audioEditor/AudioEditor";
import HomeMenu from "./homeMenu/HomeMenu";
import { useAudioEditor } from "../context/AudioEditorContext";

const MainComponent = ({ }) => {
  const { audioEditorReady, loadingPrincipalBuffer } = useAudioEditor();

  return (
    <>
      {!audioEditorReady && <HomeMenu></HomeMenu>}
      {audioEditorReady && <AudioEditorMain></AudioEditorMain>}
      {loadingPrincipalBuffer && <>
        <input type="checkbox" id="loadingBufferModal" className="modal-toggle" checked={true} />
          <div className="modal">
            <div className="modal-box">
              <h3 className="font-bold text-lg">Chargement du fichier audio</h3>
              <p className="py-4 flex items-center"><span className="loading loading-spinner loading-lg mr-4 text-info"></span> Merci de patienter quelques instants</p>
            </div>
          </div>
        </>}
    </>
  )
};

export default MainComponent;