"use client";

import { DaisyUIModal } from "@eliastik/simple-sound-studio-components";
import { useTranslation } from "react-i18next";
import AudioFileListDialog from "../dialogs/AudioFileListDialog";

const AudioPlayerPlaylistButton = () => {
    
    const { t } = useTranslation();

     return (
        <>
            <div className="tooltip" data-tip={t("audioPlayer.playlist")}>
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
            </div>
            <AudioFileListDialog></AudioFileListDialog>
        </>
    );
};

export default AudioPlayerPlaylistButton;
