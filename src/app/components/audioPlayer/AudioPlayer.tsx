"use client";

import { useCallback, useEffect } from "react";
import { useShallow } from "zustand/shallow";
import { useAudioEditor, useAudioPlayer } from "@eliastik/simple-sound-studio-components";
import AudioPlayerRange from "./AudioPlayerRange";
import AudioPlayerDownloadButton from "./AudioPlayerDownloadButton";
import AudioPlayerVolumeButton from "./AudioPlayerVolumeButton";
import AudioPlayerPlayPauseButtons from "./AudioPlayerPlayPauseButtons";
import AudioPlayerPlaylistButton from "./AudioPlayerPlaylistButton";
import AudioPlayerPreviousAudioButton from "./AudioPlayerPreviousAudioButton";
import AudioPlayerNextAudioButton from "./AudioPlayerNextAudioButton";
import AudioPlayerLoopControl from "./AudioPlayerLoopControl";

const AudioPlayer = () => {

    const audioFilesCount = useAudioEditor(useShallow(state => state.audioFilesCount));

    const [
        playAudioBuffer,
        pauseAudioBuffer,
        playing,
        maxTimeDisplay,
        currentTimeDisplay
    ] = useAudioPlayer(useShallow(state => [
        state.playAudioBuffer,
        state.pauseAudioBuffer,
        state.playing,
        state.maxTimeDisplay,
        state.currentTimeDisplay
    ]));

    const handleEvent = useCallback((e: KeyboardEvent) => {
        const active = document.activeElement;

        if (active &&
            (
                /^(input|textarea|button|select)$/i.test(active.tagName) ||
                active.hasAttribute("contenteditable")
            )
        ) {
            return;
        }

        if (e.key === " ") {
            e.preventDefault();

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
        <div className="fixed bottom-0 w-full" id="audioPlayer">
            <AudioPlayerRange></AudioPlayerRange>
            <div className="flex items-center justify-between w-full bg-base-300 h-12">
                <div className="flex items-center">
                    <AudioPlayerPlayPauseButtons></AudioPlayerPlayPauseButtons>
                    <span className="ml-2 md:ml-4 pointer-events-none" id="playerTimestamp">
                        <span id="playerCurrentTime">{currentTimeDisplay}</span> / <span id="playerMaxTime">{maxTimeDisplay}</span>
                    </span>
                </div>
                <div className="flex items-center">
                    {audioFilesCount > 1 && (
                        <AudioPlayerPreviousAudioButton></AudioPlayerPreviousAudioButton>
                    )}
                    <AudioPlayerLoopControl></AudioPlayerLoopControl>
                    {audioFilesCount > 1 && (
                        <>
                            <AudioPlayerPlaylistButton></AudioPlayerPlaylistButton>
                            <AudioPlayerNextAudioButton></AudioPlayerNextAudioButton>
                        </>
                    )}
                    <AudioPlayerVolumeButton></AudioPlayerVolumeButton>
                    <AudioPlayerDownloadButton></AudioPlayerDownloadButton>
                </div>
            </div>
        </div>
    );
};

export default AudioPlayer;
