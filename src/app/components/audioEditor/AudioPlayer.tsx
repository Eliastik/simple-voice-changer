"use client";

import { useAudioEditor } from "@/app/context/AudioEditorContext";

const AudioPlayer = ({
    percent = 0,
    currentTimeDisplay,
    maxTimeDisplay,
    playing
}: { percent: number, maxTimeDisplay: string, currentTimeDisplay: string, playing: boolean }) => {
    const { playAudioBuffer, pauseAudioBuffer } = useAudioEditor();

    return (
        <div className="fixed bottom-0 w-full">
            <div className="block w-full"><input type="range" min={0} max={100} value={percent} className="range range-player range-accent range-sm w-full rounded-none block bg-gray-250 after:bg-gray-800" /></div>
            <div className="flex items-center w-full bg-gray-200">
                {!playing && <button className="btn btn-ghost" onClick={() => playAudioBuffer()}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                    </svg>
                </button>}
                {playing && <button className="btn btn-ghost" onClick={() => pauseAudioBuffer()}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
                    </svg>
                </button>}
                <span className="ml-4 pointer-events-none">{currentTimeDisplay} / {maxTimeDisplay}</span>
            </div>
        </div>
    )
};

export default AudioPlayer;