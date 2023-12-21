"use client";

import { createContext, useContext, useState, ReactNode, FC, useEffect } from "react";
import AudioEditorPlayerSingleton from "./ApplicationObjectsSingleton";
import BufferPlayer from "../lib/BufferPlayer";
import AudioPlayerContextProps from "../model/contextProps/AudioPlayerContextProps";
import { EventType } from "../lib/model/EventTypeEnum";

let audioPlayerInstance: BufferPlayer;

const AudioPlayerContext = createContext<AudioPlayerContextProps | undefined>(undefined);

export const useAudioPlayer = (): AudioPlayerContextProps => {
    const context = useContext(AudioPlayerContext);
    if (!context) {
        throw new Error("useAudioPlayer doit être utilisé à l'intérieur d'un AudioPlayerProvider");
    }
    return context;
};

interface AudioPlayerProviderProps {
  children: ReactNode;
}

export const AudioPlayerProvider: FC<AudioPlayerProviderProps> = ({ children }) => {
    // State: true if the audio player is playing the audio
    const [playing, setPlaying] = useState(false);
    // State: the current time
    const [currentTime, setCurrentTime] = useState(0);
    // State: the current time displayed
    const [currentTimeDisplay, setCurrentTimeDisplay] = useState("00:00");
    // State: the current time
    const [maxTime, setMaxTime] = useState(0);
    // State: the current max time displayed
    const [maxTimeDisplay, setMaxTimeDisplay] = useState("00:00");
    // State: percent playing time
    const [percent, setPercent] = useState(0.0);
    // State: if the audio is looping
    const [looping, setLooping] = useState(false);
    // State: true if compatibility/direct mode is enabled for the audio player (different state from AudioPlayer possible)
    const [isCompatibilityModeEnabled, setCompatibilityModeEnabled] = useState(false);

    useEffect(() => {
        if(audioPlayerInstance != null) {
            return;
        }

        audioPlayerInstance = AudioEditorPlayerSingleton.getAudioPlayerInstance()!;

        audioPlayerInstance.on(EventType.PLAYING_FINISHED, () => setPlaying(false));
        audioPlayerInstance.on(EventType.PLAYING_UPDATE, () => updatePlayerState());

        audioPlayerInstance.on(EventType.PLAYING_STARTED, () => {
            setPlaying(true);
            updatePlayerState();
        });

        audioPlayerInstance.on(EventType.PLAYING_STOPPED, () => {
            setPlaying(false);
            updatePlayerState();
        });

        updatePlayerState();
    }, []);

    const playAudioBuffer = async () => {
        await audioPlayerInstance.start();
        setPlaying(true);
        updatePlayerState();
    };

    const pauseAudioBuffer = () => {
        audioPlayerInstance.pause();
        setPlaying(false);
        updatePlayerState();
    };

    const stopAudioBuffer = () => {
        audioPlayerInstance.stop();
        setPlaying(false);
        updatePlayerState();
    };

    const loopAudioBuffer = () => {
        audioPlayerInstance.toggleLoop();
        updatePlayerState();
    };

    const updatePlayerState = () => {
        setCurrentTimeDisplay(audioPlayerInstance.currentTimeDisplay);
        setMaxTimeDisplay(audioPlayerInstance.maxTimeDisplay);
        setPercent(audioPlayerInstance.percent);
        setLooping(audioPlayerInstance.loop);
        setCurrentTime(audioPlayerInstance.currentTime);
        setMaxTime(audioPlayerInstance.duration);
        setCompatibilityModeEnabled(audioPlayerInstance.compatibilityMode);
    };

    const setTimePlayer = (value: number) => audioPlayerInstance.setTime(value);

    return (
        <AudioPlayerContext.Provider value={{
            playing, playAudioBuffer, pauseAudioBuffer, loopAudioBuffer, setTimePlayer, stopAudioBuffer,
            currentTimeDisplay, maxTimeDisplay, percent, looping, currentTime, maxTime, isCompatibilityModeEnabled
        }}>
            {children}
        </AudioPlayerContext.Provider>
    );
};
