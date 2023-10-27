"use client";

import { useAudioEditor } from "@/app/context/AudioEditorContext";
import FilterButton from "./FilterButton";
import filters from "@/app/model/Filters";
import AudioPlayer from "./AudioPlayer";
import LoadingAudioProcessingDialog from "../dialogs/LoadingAudioProcessingDialog";
import DownloadingBufferDialog from "../dialogs/DownloadingBufferDialog";
import ErrorDownloadingBufferDialog from "../dialogs/ErrorDownloadingBufferDialog";

const AudioEditorMain = ({ }) => {
  const { audioProcessing, filterState, bufferPlaying, playerState, validateSettings, downloadingBufferData } = useAudioEditor();

  return (
    <>
      <div className="flex justify-center items-center flex-grow gap-6 flex-col pt-20 pb-20">
        <div className="grid lg:grid-cols-6 md:grid-cols-4 grid-cols-2 gap-4 place-content-center">
          {filters.map(filter => <FilterButton filter={filter} enabled={filterState[filter.filterId]} key={filter.filterId}></FilterButton>)}
        </div>
        <button className="btn btn-accent" onClick={() => validateSettings()}>Valider les paramètres</button>
      </div>
      <AudioPlayer maxTime={playerState.maxTime} currentTime={playerState.currentTime} currentTimeDisplay={playerState.currentTimeDisplay} maxTimeDisplay={playerState.maxTimeDisplay} playing={bufferPlaying} looping={playerState.loop}></AudioPlayer>
      {audioProcessing && <LoadingAudioProcessingDialog></LoadingAudioProcessingDialog>}
      {downloadingBufferData && <DownloadingBufferDialog></DownloadingBufferDialog>}
      {downloadingBufferData && <DownloadingBufferDialog></DownloadingBufferDialog>}
      <ErrorDownloadingBufferDialog></ErrorDownloadingBufferDialog>
    </>
  )
};

export default AudioEditorMain;