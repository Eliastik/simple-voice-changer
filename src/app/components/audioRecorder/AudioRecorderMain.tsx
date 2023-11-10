"use client";

import { useTranslation } from "react-i18next";
import { useAudioRecorder } from "@/app/context/AudioRecorderContext";

const AudioRecorderMain = ({ }) => {
    const { pauseRecorderAudio, audioRecording, recordAudio, stopRecordAudio, recorderTime } = useAudioRecorder();
    const { t } = useTranslation();

    return (
        <>
            <div className="toast toast-top toast-center"></div>
            <div className="flex justify-center items-center flex-grow flex-col pt-20 pb-20 gap-8">
                <span className="font-light text-6xl">{recorderTime}</span>
                <div className="flex gap-4 flex-row">
                    {!audioRecording && <button className="btn flex-col justify-evenly pl-2 pr-2 w-44 h-52" onClick={() => recordAudio()}>
                        <div className="fill-base-content">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                            </svg>
                        </div>
                        <span>{t("audioRecorder.record")}</span>
                    </button>}
                    {audioRecording && <button className="btn flex-col justify-evenly pl-2 pr-2 w-44 h-52" onClick={() => pauseRecorderAudio()}>
                        <div className="fill-base-content">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
                            </svg>
                        </div>
                        <span>{t("audioRecorder.pause")}</span>
                    </button>}
                    <button className="btn flex-col justify-evenly pl-2 pr-2 w-44 h-52" onClick={() => stopRecordAudio()}>
                        <div className="fill-base-content">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 7.5A2.25 2.25 0 017.5 5.25h9a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25 2.25h-9a2.25 2.25 0 01-2.25-2.25v-9z" />
                            </svg>
                        </div>
                        <span>{t("audioRecorder.stop")}</span>
                    </button>
                </div>
                <button className="btn flex flex-row p-5 w-auto h-auto gap-x-4" onClick={() => {

                }}>
                    <div className="fill-base-content">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </div>
                    <span>{t("audioRecorder.settings")}</span>
                </button>
            </div>
        </>
    )
};

export default AudioRecorderMain;