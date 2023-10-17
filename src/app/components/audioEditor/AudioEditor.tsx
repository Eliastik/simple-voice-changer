"use client";

import { useAudioEditor } from "@/app/context/AudioEditorContext";
import FilterButton from "./FilterButton";
import filters from "@/app/utils/filters";
import AudioPlayer from "./AudioPlayer";

const AudioEditorMain = ({ }) => {
  const { audioProcessing, filterState, bufferPlaying, playerState, validateSettings } = useAudioEditor();

  return (
    <>
      <div className="flex justify-center items-center flex-grow gap-6 flex-col pt-20 pb-20">
        <div className="grid lg:grid-cols-6 md:grid-cols-4 grid-cols-2 gap-4 place-content-center">
          {filters.map(filter => {
            return (
              <>
                <FilterButton filter={filter} enabled={filterState[filter.filterId]}></FilterButton>
              </>
            )
          })}
        </div>
        <button className="btn btn-accent" onClick={() => validateSettings()}>Valider les paramètres</button>
      </div>
      <AudioPlayer maxTime={playerState.maxTime} currentTime={playerState.currentTime} currentTimeDisplay={playerState.currentTimeDisplay} maxTimeDisplay={playerState.maxTimeDisplay} playing={bufferPlaying} looping={playerState.loop}></AudioPlayer>
      {audioProcessing && <>
        <input type="checkbox" id="loadingAudioProcessing" className="modal-toggle" checked={true} />
        <div className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Traitement en cours</h3>
            <p className="py-4 flex items-center"><span className="loading loading-spinner loading-lg mr-4 text-info"></span> Merci de patienter quelques instants</p>
          </div>
        </div>
      </>}
    </>
  )
};

export default AudioEditorMain;