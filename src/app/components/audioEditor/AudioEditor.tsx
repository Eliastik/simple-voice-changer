"use client";

import { useAudioEditor } from "@/app/context/AudioEditorContext";
import FilterButton from "./FilterButton";
import filters from "@/app/utils/filters";

const AudioEditorMain = ({ }) => {
  const { audioProcessing, filterState } = useAudioEditor();

  return (
    <>
      <div className="flex justify-center items-center flex-grow gap-6 flex-col lg:flex-row mt-16">
        <div className="grid lg:grid-cols-6 md:grid-cols-4 grid-cols-2 gap-4 place-content-center">
          {filters.map(filter => {
            return (
              <>
                <FilterButton filterId={filter.filterId} filterName={filter.filterName} filterIcon={filter.filterIcon} enabled={filterState[filter.filterId]} hasSettings={filter.hasSettings}></FilterButton>
              </>
            )
          })}
        </div>
      </div>
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