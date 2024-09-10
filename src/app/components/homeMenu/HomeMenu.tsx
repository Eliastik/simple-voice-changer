"use client";

import { useAudioEditor } from "@eliastik/simple-sound-studio-components";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { useAudioRecorder } from "@/app/context/AudioRecorderContext";

const HomeMenu = () => {
    const inputFile = useRef<HTMLInputElement | null>(null);
    const { loadAudioFileList } = useAudioEditor();
    const { initRecorder, recorderUnavailable } = useAudioRecorder();
    const { t } = useTranslation();

    return (
        <div className="flex justify-center items-center flex-grow gap-6 flex-col lg:flex-row pt-16">
            <input type="file"
                id="file"
                ref={inputFile}
                style={{ display: "none" }}
                accept="audio/*"
                multiple={true}
                onChange={(e) => loadAudioFileList(e.target.files)}
            />
            <button className="btn flex-col w-48 h-64 lg:w-52 lg:h-72 2xl:w-60 2xl:h-80 gap-8" onClick={() => {
                inputFile.current?.click();
            }}>
                <div className="fill-base-content">
                    <svg xmlns="http://www.w3.org/2000/svg" height="1.5em" viewBox="0 0 512 512"><path d="M499.1 6.3c8.1 6 12.9 15.6 12.9 25.7v72V368c0 44.2-43 80-96 80s-96-35.8-96-80s43-80 96-80c11.2 0 22 1.6 32 4.6V147L192 223.8V432c0 44.2-43 80-96 80s-96-35.8-96-80s43-80 96-80c11.2 0 22 1.6 32 4.6V200 128c0-14.1 9.3-26.6 22.8-30.7l320-96c9.7-2.9 20.2-1.1 28.3 5z" /></svg>
                </div>
                <span>{t("homeMenu.selectAudioFile")}</span>
            </button>
            <div className={recorderUnavailable ? "tooltip" : ""} data-tip={t("audioRecorder.notAvailable")}>
                <button className="btn flex-col w-48 h-64 lg:w-52 lg:h-72 2xl:w-60 2xl:h-80 gap-8" disabled={recorderUnavailable} onClick={() => {
                    initRecorder();
                }}>
                    <div className={!recorderUnavailable ? "fill-base-content" : "fill-base-content opacity-20"}>
                        <svg xmlns="http://www.w3.org/2000/svg" height="1.5em" viewBox="0 0 384 512"><path d="M192 0C139 0 96 43 96 96V256c0 53 43 96 96 96s96-43 96-96V96c0-53-43-96-96-96zM64 216c0-13.3-10.7-24-24-24s-24 10.7-24 24v40c0 89.1 66.2 162.7 152 174.4V464H120c-13.3 0-24 10.7-24 24s10.7 24 24 24h72 72c13.3 0 24-10.7 24-24s-10.7-24-24-24H216V430.4c85.8-11.7 152-85.3 152-174.4V216c0-13.3-10.7-24-24-24s-24 10.7-24 24v40c0 70.7-57.3 128-128 128s-128-57.3-128-128V216z" /></svg>
                    </div>
                    <span>{t("homeMenu.recMicrophone")}</span>
                </button>
            </div>
        </div>
    );
};

export default HomeMenu;
