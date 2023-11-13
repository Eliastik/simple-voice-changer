"use client";

import { useAudioEditor } from "@/app/context/AudioEditorContext";
import FilterButton from "./FilterButton";
import filters from "@/app/model/Filters";
import AudioPlayer from "./AudioPlayer";
import LoadingAudioProcessingDialog from "../dialogs/LoadingAudioProcessingDialog";
import DownloadingBufferDialog from "../dialogs/DownloadingBufferDialog";
import ErrorDownloadingBufferDialog from "../dialogs/ErrorDownloadingBufferDialog";
import { useTranslation } from "react-i18next";

const AudioEditorMain = ({ }) => {
  const { audioProcessing, filterState, validateSettings, downloadingBufferData, resetAllFiltersState, isCompatibilityModeAutoEnabled } = useAudioEditor();
  const { t } = useTranslation();

  return (
    <>
      <div className="toast toast-top toast-center">
        {isCompatibilityModeAutoEnabled && <div className="alert alert-info">
            <span>{t("audioEditorMain.compatibilityModeAutoEnabled")}</span>
        </div>}
      </div>
      <div className="flex justify-center items-center flex-grow gap-6 flex-col pt-20 pb-20">
        <div className="grid lg:grid-cols-6 md:grid-cols-4 grid-cols-2 gap-4 place-content-center">
          {filters.map(filter => <FilterButton filter={filter} enabled={filterState[filter.filterId]} key={filter.filterId}></FilterButton>)}
        </div>
        <div className="flex flex-row gap-x-4">
          <button className="btn btn-accent" onClick={() => validateSettings()}>{t("audioEditorMain.validateSettings")}</button>
          <button className="btn btn-error" onClick={() => resetAllFiltersState()}>{t("audioEditorMain.resetSettings")}</button>
        </div>
      </div>
      <AudioPlayer></AudioPlayer>
      {audioProcessing && <LoadingAudioProcessingDialog></LoadingAudioProcessingDialog>}
      {downloadingBufferData && <DownloadingBufferDialog></DownloadingBufferDialog>}
    </>
  )
};

export default AudioEditorMain;