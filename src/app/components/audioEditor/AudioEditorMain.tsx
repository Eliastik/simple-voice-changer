"use client";

import { AudioEditorActionButtons, FilterButtonList, DownloadingBufferDialog, LoadingAudioProcessingDialog } from "@eliastik/simple-sound-studio-components";
import { useApplicationConfig } from "@/app/context/ApplicationConfigContext";
import { useTranslation } from "react-i18next";
import AudioPlayer from "./AudioPlayer";

const AudioEditorMain = () => {
    const { isCompatibilityModeAutoEnabled, hasProblemRenderingAudio } = useApplicationConfig();
    const { t } = useTranslation();

    return (
        <>
            <div className="toast toast-top toast-center md:w-2/4 w-3/4 pointer-events-none z-50">
                {isCompatibilityModeAutoEnabled && <div className="alert alert-info text-center w-auto opacity-90 flex flex-col gap-y-1 pointer-events-none">
                    <span className="whitespace-normal">{t("audioEditorMain.compatibilityModeAutoEnabled")}</span>
                </div>}
                {hasProblemRenderingAudio && <div className="alert alert-info text-center w-auto opacity-90 flex flex-col gap-y-1 pointer-events-none">
                    <span className="whitespace-normal">{t("audioEditorMain.hasProblemRenderingAudio")}</span>
                </div>}
            </div>
            <div className="flex justify-center items-center flex-grow gap-6 flex-col pt-16 pb-16">
                <div className="grid lg:grid-cols-6 md:grid-cols-4 grid-cols-3 md:gap-4 gap-2 place-content-center p-2 md:mt-2 md:p-0">
                    <FilterButtonList></FilterButtonList>
                </div>
                <div className="flex flex-row md:gap-x-3 gap-x-1 sticky bottom-20">
                    <AudioEditorActionButtons></AudioEditorActionButtons>
                </div>
            </div>
            <AudioPlayer></AudioPlayer>
            <LoadingAudioProcessingDialog></LoadingAudioProcessingDialog>
            <DownloadingBufferDialog></DownloadingBufferDialog>
        </>
    );
};

export default AudioEditorMain;
