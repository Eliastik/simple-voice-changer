"use client";

import { useAudioPlayer } from "@eliastik/simple-sound-studio-components";
import { useTranslation } from "react-i18next";
import { useShallow } from "zustand/shallow";

const AudioPlayerPlayPauseButtons = () => {
    
    const { t } = useTranslation();

    const [
        playAudioBuffer,
        pauseAudioBuffer,
        isCompatibilityModeEnabled,
        stopAudioBuffer,
        playing
    ] = useAudioPlayer(useShallow(state => [
        state.playAudioBuffer,
        state.pauseAudioBuffer,
        state.isCompatibilityModeEnabled,
        state.stopAudioBuffer,
        state.playing
    ]));

     return (
        <>
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
        </>
    );
};

export default AudioPlayerPlayPauseButtons;
