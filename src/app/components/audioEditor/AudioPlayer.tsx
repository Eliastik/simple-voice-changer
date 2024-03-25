"use client";

import { useCallback, useEffect } from "react";
import { useAudioEditor, useAudioPlayer } from "@eliastik/simple-sound-studio-components";
import { useTranslation } from "react-i18next";

const AudioPlayer = () => {
    const { downloadAudio } = useAudioEditor();
    const { playAudioBuffer, pauseAudioBuffer, loopAudioBuffer, setTimePlayer, isCompatibilityModeEnabled, stopAudioBuffer, playing, maxTime, maxTimeDisplay, currentTime, currentTimeDisplay, looping } = useAudioPlayer();
    const { t } = useTranslation();

    const handleEvent = useCallback((e: KeyboardEvent) => {
        if (e.key === " ") {
            if (playing) {
                pauseAudioBuffer();
            } else {
                playAudioBuffer();
            }
        }
    }, [playing, pauseAudioBuffer, playAudioBuffer]);

    useEffect(() => {
        document.body.addEventListener("keydown", handleEvent);
        return () => document.body.removeEventListener("keydown", handleEvent);
    }, [handleEvent]);

    return (
        <>
            <div className="fixed bottom-0 w-full">
                <div className="block w-full">
                    <input
                        type="range"
                        min={0}
                        max={maxTime}
                        value={currentTime}
                        className="range range-player range-accent range-sm w-full rounded-none block bg-gray-250 after:bg-gray-800 backdrop-blur-sm"
                        onChange={(event) => setTimePlayer(parseFloat(event.target.value))} />
                </div>
                <div className="flex items-center justify-between w-full bg-base-300">
                    <div className="flex items-center">
                        {!playing &&
                            <div className="tooltip" data-tip={t("audioPlayer.play")}><button className="btn btn-ghost" onClick={() => playAudioBuffer()}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                                </svg>
                            </button></div>}
                        {playing && !isCompatibilityModeEnabled &&
                            <div className="tooltip" data-tip={t("audioPlayer.pause")}><button className="btn btn-ghost" onClick={() => pauseAudioBuffer()}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
                                </svg>
                            </button></div>}
                        {playing && isCompatibilityModeEnabled &&
                            <div className="tooltip" data-tip={t("audioPlayer.stop")}><button className="btn btn-ghost" onClick={() => stopAudioBuffer()}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 7.5A2.25 2.25 0 017.5 5.25h9a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25 2.25h-9a2.25 2.25 0 01-2.25-2.25v-9z" />
                                </svg>
                            </button></div>}
                        <span className="ml-4 pointer-events-none">{currentTimeDisplay} / {maxTimeDisplay}</span>
                    </div>
                    <div className="flex items-center">
                        <div className="tooltip" data-tip={t("audioPlayer.loop")}>
                            <button className={`btn btn-ghost ${looping ? "bg-secondary" : ""}`} onClick={() => loopAudioBuffer()}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                                </svg>
                            </button>
                        </div>
                        <div className="tooltip tooltip-left" data-tip={t("audioPlayer.save")}>
                            <button className="btn btn-ghost" onClick={() => downloadAudio()}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AudioPlayer;
