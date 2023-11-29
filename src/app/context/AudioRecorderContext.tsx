"use client";

import { createContext, useContext, useState, ReactNode, FC, useEffect } from "react";
import AudioEditorPlayerSingleton from "./ApplicationObjectsSingleton";
import AudioRecorderContextProps from "../model/contextProps/AudioRecorderContextProps";
import VoiceRecorder from "../classes/VoiceRecorder";
import { EventType } from "../classes/model/EventTypeEnum";
import { RecorderSettings } from "../classes/model/RecorderSettings";

let audioRecorderInstance: VoiceRecorder;

const AudioRecorderContext = createContext<AudioRecorderContextProps | undefined>(undefined);

export const useAudioRecorder = (): AudioRecorderContextProps => {
    const context = useContext(AudioRecorderContext);
    if (!context) {
        throw new Error("useAudioRecorder doit être utilisé à l'intérieur d'un AudioRecorderProvider");
    }
    return context;
};

interface AudioRecorderProviderProps {
  children: ReactNode;
}

export const AudioRecorderProvider: FC<AudioRecorderProviderProps> = ({ children }) => {
    // State: true if the recorder is ready (the user has allowed access to microphone)
    const [audioRecorderReady, setAudioRecorderReady] = useState(false);
    // State: true if there are an error (when allowing acces to microphone)
    const [audioRecorderHasError, setAudioRecorderHasError] = useState(false);
    // State: true if the authorization request is pending
    const [audioRecorderAuthorizationPending, setAudioRecorderAuthorizationPending] = useState(false);
    // State: true if recording
    const [audioRecording, setAudioRecording] = useState(false);
    // State: current display time
    const [recorderDisplayTime, setRecorderDisplayTime] = useState("00:00");
    // State: current time
    const [recorderTime, setRecorderTime] = useState(0);
    // State: settings
    const [recorderSettings, setRecorderSettings] = useState<RecorderSettings>({ constraints: {}, deviceList: [], audioFeedback: false });
    // State: recorder unavailable (in not secure context for example)
    const [recorderUnavailable, setRecorderUnavailable] = useState(false);

    useEffect(() => {
        if (audioRecorderInstance != null) {
            return;
        }

        audioRecorderInstance = AudioEditorPlayerSingleton.getAudioRecorderInstance()!;

        audioRecorderInstance.on(EventType.RECORDER_ERROR, () => setAudioRecorderHasError(true));
        audioRecorderInstance.on(EventType.RECORDER_RECORDING, () => setAudioRecording(true));
        audioRecorderInstance.on(EventType.RECORDER_PAUSED, () => setAudioRecording(false));
        audioRecorderInstance.on(EventType.RECORDER_UPDATE_CONSTRAINTS, () => setRecorderSettings(audioRecorderInstance.getSettings()));
        audioRecorderInstance.on(EventType.RECORDER_RESETED, () => resetRecorderState());
    
        audioRecorderInstance.on(EventType.RECORDER_COUNT_UPDATE, () => {
            setRecorderDisplayTime(audioRecorderInstance.currentTimeDisplay);
            setRecorderTime(audioRecorderInstance.currentTime);
        });

        audioRecorderInstance.on(EventType.RECORDER_STOPPED, () => {
            setAudioRecording(false);
            setAudioRecorderReady(false);
        });

        audioRecorderInstance.on(EventType.RECORDER_SUCCESS, () => {
            setAudioRecorderReady(true);
            setAudioRecorderHasError(false);
            resetRecorderState();
        });

        setRecorderUnavailable(!audioRecorderInstance.isRecordingAvailable());
    }, []);

    const initRecorder = async () => {
        try {
            setAudioRecorderAuthorizationPending(true);
            await audioRecorderInstance.init();
            setAudioRecorderAuthorizationPending(false);
            setRecorderSettings(audioRecorderInstance.getSettings());
        } catch(e) {
            console.error(e);
            setAudioRecorderAuthorizationPending(false);
        }
    };

    const resetRecorderState = () => {
        setAudioRecording(false);
        setRecorderDisplayTime(audioRecorderInstance.currentTimeDisplay);
        setRecorderTime(audioRecorderInstance.currentTime);
        setRecorderSettings(audioRecorderInstance.getSettings());
    };

    const exitAudioRecorder = () => {
        audioRecorderInstance.reset();
        setAudioRecorderReady(false);
    };

    const recordAudio = () => audioRecorderInstance.record();
    const pauseRecorderAudio = () => audioRecorderInstance.pause();
    const stopRecordAudio = () => audioRecorderInstance.stop();
    const changeInput = (deviceId: string, groupId: string | undefined) => audioRecorderInstance.changeInput(deviceId, groupId);
    const toggleAudioFeedback = (enable: boolean) => audioRecorderInstance.audioFeedback(enable);
    const toggleEchoCancellation = (enable: boolean) => audioRecorderInstance.setEchoCancellation(enable);
    const toggleNoiseReduction = (enable: boolean) => audioRecorderInstance.setNoiseSuppression(enable);
    const toggleAutoGainControl = (enable: boolean) => audioRecorderInstance.setAutoGain(enable);

    const closeAudioRecorderError = () => setAudioRecorderHasError(false);

    return (
        <AudioRecorderContext.Provider value={{
            audioRecorderReady, audioRecorderHasError, initRecorder, audioRecorderAuthorizationPending,
            closeAudioRecorderError, audioRecording, recordAudio, pauseRecorderAudio, stopRecordAudio,
            recorderDisplayTime, exitAudioRecorder, recorderTime, recorderSettings, changeInput,
            toggleAudioFeedback, toggleEchoCancellation, toggleNoiseReduction, toggleAutoGainControl,
            recorderUnavailable
        }}>
            {children}
        </AudioRecorderContext.Provider>
    );
};