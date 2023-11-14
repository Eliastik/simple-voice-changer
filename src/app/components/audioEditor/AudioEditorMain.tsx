"use client";

import { useAudioEditor } from "@/app/context/AudioEditorContext";
import FilterButton from "./FilterButton";
import filters from "@/app/model/Filters";
import AudioPlayer from "./AudioPlayer";
import LoadingAudioProcessingDialog from "../dialogs/LoadingAudioProcessingDialog";
import DownloadingBufferDialog from "../dialogs/DownloadingBufferDialog";
import { useTranslation } from "react-i18next";

const AudioEditorMain = ({ }) => {
  const { filterState, validateSettings, resetAllFiltersState, isCompatibilityModeAutoEnabled } = useAudioEditor();
  const { t } = useTranslation();

  return (
    <>
      <div className="toast toast-top toast-center">
        {isCompatibilityModeAutoEnabled && <div className="alert alert-info">
            <span>{t("audioEditorMain.compatibilityModeAutoEnabled")}</span>
        </div>}
      </div>
      <div className="flex justify-center items-center flex-grow gap-6 flex-col pt-20 pb-20">
        <div className="grid lg:grid-cols-6 md:grid-cols-4 grid-cols-3 md:gap-4 gap-2 place-content-center p-3 md:p-0">
          {filters.map(filter => <FilterButton filter={filter} enabled={filterState[filter.filterId]} key={filter.filterId}></FilterButton>)}
        </div>
        <div className="flex flex-row gap-x-3 sticky bottom-20">
          <button className="btn btn-accent opacity-80" onClick={() => validateSettings()}>{t("audioEditorMain.validateSettings")}</button>
          <button className="btn btn-error opacity-80" onClick={() => resetAllFiltersState()}>{t("audioEditorMain.resetSettings")}</button>
        </div>
      </div>
      <AudioPlayer></AudioPlayer>
      <LoadingAudioProcessingDialog></LoadingAudioProcessingDialog>
      <DownloadingBufferDialog></DownloadingBufferDialog>
    </>
  )
};

export default AudioEditorMain;