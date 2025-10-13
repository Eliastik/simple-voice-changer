"use client";

import { useShallow } from "zustand/shallow";
import { useTranslation } from "react-i18next";
import { useAudioEditor } from "@eliastik/simple-sound-studio-components";

const AudioPlayerPreviousAudioButton = () => {
    
    const { t } = useTranslation();

    const loadPreviousAudio = useAudioEditor(useShallow(state => state.loadPreviousAudio));

     return (
        <div className="tooltip" data-tip={t("audioPlayer.previousMedia")}>
            <button className="btn btn-ghost pr-1 pl-1 md:pr-2 md:pl-2" id="previousMediaButton" onClick={() => loadPreviousAudio()}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 16.811c0 .864-.933 1.406-1.683.977l-7.108-4.061a1.125 1.125 0 0 1 0-1.954l7.108-4.061A1.125 1.125 0 0 1 21 8.689v8.122ZM11.25 16.811c0 .864-.933 1.406-1.683.977l-7.108-4.061a1.125 1.125 0 0 1 0-1.954l7.108-4.061a1.125 1.125 0 0 1 1.683.977v8.122Z" />
                </svg>
            </button>
        </div>
    );
};

export default AudioPlayerPreviousAudioButton;
