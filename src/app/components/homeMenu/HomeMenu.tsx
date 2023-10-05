"use client";

import { useAudioEditor } from "@/app/context/AudioEditorContext";
import { useRef } from "react";

const HomeMenu = () => {
    const inputFile = useRef<HTMLInputElement | null>(null);
    const { loadAudioPrincipalBuffer } = useAudioEditor();

    return (
        <div className="flex justify-center items-center flex-grow gap-6 flex-col lg:flex-row">
            <input type="file" id="file" ref={inputFile} style={{ display: "none" }} accept="audio/*" onChange={(e) => loadAudioPrincipalBuffer(e.target.files![0])} />
            <button className="btn flex-col w-48 h-64 gap-8" onClick={() => {
                inputFile.current?.click();
            }}>
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z" />
                    </svg>
                </div>
                <div>Sélectionner un fichier audio</div>
            </button>
            <button className="btn flex-col w-48 h-64 gap-8">
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                    </svg>
                </div>
                <div>Enregistrer via le micro</div>
            </button>
        </div>
    );
};

export default HomeMenu;