"use client";

import { useTranslation } from "react-i18next";
import { useShallow } from "zustand/shallow";
import { useAudioEditor } from "@eliastik/simple-sound-studio-components";

const AudioPlayerNextAudioButton = () => {
    
    const { t } = useTranslation();

    const loadNextAudio = useAudioEditor(useShallow(state => state.loadNextAudio));

     return (
        <div className="tooltip tooltip-left" data-tip={t("audioPlayer.nextMedia")}>
            <button className="btn btn-ghost pr-1 pl-1 md:pr-2 md:pl-2" id="nextMediaButton" onClick={() => loadNextAudio()}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8.689c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 0 1 0 1.954l-7.108 4.061A1.125 1.125 0 0 1 3 16.811V8.69ZM12.75 8.689c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 0 1 0 1.954l-7.108 4.061a1.125 1.125 0 0 1-1.683-.977V8.69Z" />
                </svg>
            </button>
        </div>
    );
};

export default AudioPlayerNextAudioButton;
