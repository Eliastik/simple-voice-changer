"use client";

import { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { DaisyUIModal, useAudioEditor, useAudioPlayer } from "@eliastik/simple-sound-studio-components";
import { useApplicationConfig } from "@/app/context/ApplicationConfigContext";
import AudioFileListDialog from "../dialogs/AudioFileListDialog";

const AudioPlayer = () => {
    const { downloadAudio, loadPreviousAudio, loadNextAudio, audioFilesCount } = useAudioEditor();
    const { bitrateMP3 } = useApplicationConfig();
    const { playAudioBuffer, pauseAudioBuffer, loopAudioBuffer, setTimePlayer, isCompatibilityModeEnabled, stopAudioBuffer, playing, maxTime, maxTimeDisplay, currentTime, currentTimeDisplay, looping, loopingAll, loopAllAudioBuffer } = useAudioPlayer();
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

    const removeOpenAttribute = () => {
        document.querySelector("#dropdownDownloadAudio")?.removeAttribute("open");
        return true;
    };

    useEffect(() => {
        document.body.addEventListener("keydown", handleEvent);
        return () => document.body.removeEventListener("keydown", handleEvent);
    }, [handleEvent]);

    const loopAudioButton = (
        <div className="tooltip" data-tip={audioFilesCount > 1 ? t("audioPlayer.loopMultipleFile") : t("audioPlayer.loop")}>
            <button className={`btn btn-ghost pr-2 pl-2 md:pr-4 md:pl-4 ${(loopingAll || (audioFilesCount <= 1 && looping)) ? "bg-secondary text-black " : ""}`} id="loopPlayingButton" onClick={() => {
                if (audioFilesCount > 1 && !loopingAll) {
                    loopAllAudioBuffer();
                } else {
                    loopAudioBuffer();
                }
            }}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
            </button>
        </div>
    );

    const loopOneAudioButton = (
        <div className="tooltip" data-tip={audioFilesCount > 1 ? t("audioPlayer.loopMultipleFile") : t("audioPlayer.loop")}>
            <button className={`btn btn-ghost pr-2 pl-2 md:pr-4 md:pl-4 ${looping ? "bg-secondary text-black" : ""}`} id="loopPlayingButton" onClick={() => loopAudioBuffer()}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path d="m16.023 9.3484h4.9926v-0.00178m-18.031 10.298v-4.9927m0 0h4.9926m-4.9926 0 3.1809 3.183c0.99053 0.9924 2.2476 1.7453 3.6993 2.1343 4.401 1.1793 8.9248-1.4326 10.104-5.8337m-15.938-4.2705c1.1793-4.4011 5.703-7.0129 10.104-5.8336 1.4517 0.38899 2.7088 1.1419 3.6993 2.1343l3.1812 3.1811m0-4.9908v4.9908" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                    <g fill="currentColor" stroke="currentColor" strokeWidth="1px" aria-label="1">
                        <path d="m10.295 15.168h1.7333v-6.1227q0-0.18133 0.016-0.384l-1.664 1.4773q-0.07467 0.064-0.14933 0.048-0.07467-0.016-0.11733-0.064l-0.15467-0.21333 2.1813-1.9253h0.4v7.184h1.648v0.39467h-3.8933z"/>
                    </g>
                </svg>
            </button>
        </div>
    );

    return (
        <>
            <div className="fixed bottom-0 w-full" id="audioPlayer">
                <div className="block w-full">
                    <input
                        type="range"
                        id="audioPlayerProgress"
                        min={0}
                        max={maxTime}
                        value={currentTime}
                        className="range range-player range-accent range-sm w-full rounded-none block bg-gray-250 after:bg-gray-800 backdrop-blur-sm"
                        onChange={(event) => setTimePlayer(parseFloat(event.target.value))} />
                </div>
                <div className="flex items-center justify-between w-full bg-base-300">
                    <div className="flex items-center">
                        {!playing &&
                            <div className="tooltip" id="playButton" data-tip={t("audioPlayer.play")}>
                                <button className="btn btn-ghost pr-2 pl-2 md:pr-4 md:pl-4" onClick={() => playAudioBuffer()}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                                    </svg>
                                </button>
                            </div>}
                        {playing && !isCompatibilityModeEnabled &&
                            <div className="tooltip" id="pauseButton" data-tip={t("audioPlayer.pause")}>
                                <button className="btn btn-ghost pr-2 pl-2 md:pr-4 md:pl-4" onClick={() => pauseAudioBuffer()}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
                                    </svg>
                                </button>
                            </div>}
                        {playing && isCompatibilityModeEnabled &&
                            <div className="tooltip" id="stopPlayingButton" data-tip={t("audioPlayer.stop")}>
                                <button className="btn btn-ghost pr-2 pl-2 md:pr-4 md:pl-4" onClick={() => stopAudioBuffer()}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 7.5A2.25 2.25 0 017.5 5.25h9a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25 2.25h-9a2.25 2.25 0 01-2.25-2.25v-9z" />
                                    </svg>
                                </button>
                            </div>}
                        <span className="ml-2 md:ml-4 pointer-events-none" id="playerTimestamp"><span id="playerCurrentTime">{currentTimeDisplay}</span> / <span id="playerMaxTime">{maxTimeDisplay}</span></span>
                    </div>
                    <div className="flex items-center">
                        {audioFilesCount > 1 && <div className="tooltip" data-tip={t("audioPlayer.previousMedia")}>
                            <button className="btn btn-ghost pr-1 pl-1 md:pr-2 md:pl-2" id="previousMediaButton" onClick={() => loadPreviousAudio()}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 16.811c0 .864-.933 1.406-1.683.977l-7.108-4.061a1.125 1.125 0 0 1 0-1.954l7.108-4.061A1.125 1.125 0 0 1 21 8.689v8.122ZM11.25 16.811c0 .864-.933 1.406-1.683.977l-7.108-4.061a1.125 1.125 0 0 1 0-1.954l7.108-4.061a1.125 1.125 0 0 1 1.683.977v8.122Z" />
                                </svg>
                            </button>
                        </div>}
                        {audioFilesCount <= 1 && loopAudioButton}
                        {audioFilesCount > 1 && !looping && loopAudioButton}
                        {audioFilesCount > 1 && looping && loopOneAudioButton}
                        {audioFilesCount > 1 && <div className="tooltip" data-tip={t("audioPlayer.playlist")}>
                            <button className="btn btn-ghost pr-2 pl-2 md:pr-4 md:pl-4" id="playlistButton" onClick={() => (document.getElementById("modalAudioFileList")! as DaisyUIModal).showModal()}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="m2.0448 5.0677h19.91m-19.91 0h0.00905v0.00863h-0.00905z" strokeWidth="1.767"/>
                                        <path d="m2.0497 9.7076h7.0903m-7.0903 0h0.00322v0.023805h-0.00322z" strokeWidth="1.7518"/>
                                        <path d="m2.0497 14.308h7.0903m-7.0903 0h0.00322v0.02381h-0.00322z" strokeWidth="1.7518"/>
                                    </g>
                                    <g transform="matrix(.71032 0 0 .71032 8.7997 5.7734)" fill="none">
                                        <path d="m5.25 5.6527c0-0.85568 0.9174-1.3981 1.6672-0.98575l11.541 6.3473c0.7772 0.4274 0.7772 1.5441 0 1.9715l-11.541 6.3473c-0.74976 0.4124-1.6672-0.1301-1.6672-0.9857z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"/>
                                    </g>
                                    <path d="m2.0497 18.908h7.0903m-7.0903 0h0.00322v0.0238h-0.00322z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7518"/>
                                </svg>
                            </button>
                        </div>}
                        {audioFilesCount > 1 && <div className="tooltip tooltip-left" data-tip={t("audioPlayer.nextMedia")}>
                            <button className="btn btn-ghost pr-1 pl-1 md:pr-2 md:pl-2" id="nextMediaButton" onClick={() => loadNextAudio()}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8.689c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 0 1 0 1.954l-7.108 4.061A1.125 1.125 0 0 1 3 16.811V8.69ZM12.75 8.689c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 0 1 0 1.954l-7.108 4.061a1.125 1.125 0 0 1-1.683-.977V8.69Z" />
                                </svg>
                            </button>
                        </div>}
                        <div className="tooltip tooltip-left" data-tip={t("audioPlayer.save")}>
                            <details className="dropdown dropdown-top dropdown-end" id="dropdownDownloadAudio">
                                <summary role="button" className="btn btn-ghost pr-2 pl-2 md:pr-4 md:pl-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                    </svg>
                                </summary>
                                <ul className="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-52">
                                    <li onClick={() => removeOpenAttribute() && downloadAudio({ format: "mp3", bitrate: bitrateMP3 })}><a>{t("audioPlayer.saveToMp3")}</a></li>
                                    <li onClick={() => removeOpenAttribute() && downloadAudio({ format: "wav" })}><a>{t("audioPlayer.saveToWav")}</a></li>
                                </ul>
                            </details>
                        </div>
                    </div>
                </div>
            </div>
            <AudioFileListDialog></AudioFileListDialog>
        </>
    );
};

export default AudioPlayer;
