"use client";

import { createContext, useContext, useState, ReactNode, FC, useEffect } from "react";
import { ApplicationObjectsSingleton } from "@eliastik/simple-sound-studio-components/lib";;
import { BufferPlayer, EventType } from "@eliastik/simple-sound-studio-lib";
import AudioPlayerContextProps from "../model/contextProps/AudioPlayerContextProps";

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

const getAudioPlayer = (): BufferPlayer => {
    return ApplicationObjectsSingleton.getAudioPlayerInstance()!;
};

let isReady = false;

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
        if (isReady) {
            return;
        }

        getAudioPlayer().on(EventType.PLAYING_FINISHED, () => setPlaying(false));
        getAudioPlayer().on(EventType.PLAYING_UPDATE, () => updatePlayerState());

        getAudioPlayer().on(EventType.PLAYING_STARTED, () => {
            setPlaying(true);
            updatePlayerState();
        });

        getAudioPlayer().on(EventType.PLAYING_STOPPED, () => {
            setPlaying(false);
            updatePlayerState();
        });

        updatePlayerState();

        isReady = true;
    }, []);

    const playAudioBuffer = async () => {
        await getAudioPlayer().start();
        setPlaying(true);
        updatePlayerState();
    };

    const pauseAudioBuffer = () => {
        getAudioPlayer().pause();
        setPlaying(false);
        updatePlayerState();
    };

    const stopAudioBuffer = () => {
        getAudioPlayer().stop();
        setPlaying(false);
        updatePlayerState();
    };

    const loopAudioBuffer = () => {
        getAudioPlayer().toggleLoop();
        updatePlayerState();
    };

    const updatePlayerState = () => {
        setCurrentTimeDisplay(getAudioPlayer().currentTimeDisplay);
        setMaxTimeDisplay(getAudioPlayer().maxTimeDisplay);
        setPercent(getAudioPlayer().percent);
        setLooping(getAudioPlayer().loop);
        setCurrentTime(getAudioPlayer().currentTime);
        setMaxTime(getAudioPlayer().duration);
        setCompatibilityModeEnabled(getAudioPlayer().compatibilityMode);
    };

    const setTimePlayer = (value: number) => getAudioPlayer().setTime(value);

    return (
        <AudioPlayerContext.Provider value={{
            playing, playAudioBuffer, pauseAudioBuffer, loopAudioBuffer, setTimePlayer, stopAudioBuffer,
            currentTimeDisplay, maxTimeDisplay, percent, looping, currentTime, maxTime, isCompatibilityModeEnabled
        }}>
            {children}
        </AudioPlayerContext.Provider>
    );
};
