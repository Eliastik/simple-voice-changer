"use client";

import { createContext, useContext, useState, ReactNode, FC, useEffect } from "react";
import { SoundStudioApplicationFactory } from "@eliastik/simple-sound-studio-components";
import { VoiceRecorder, EventType, RecorderSettings } from "@eliastik/simple-sound-studio-lib";
import AudioRecorderContextProps from "../model/contextProps/AudioRecorderContextProps";

const AudioRecorderContext = createContext<AudioRecorderContextProps | undefined>(undefined);

export const useAudioRecorder = (): AudioRecorderContextProps => {
    const context = useContext(AudioRecorderContext);
    if (!context) {
        throw new Error("useAudioRecorder must be used inside an AudioRecorderProvider");
    }
    return context;
};

interface AudioRecorderProviderProps {
    children: ReactNode;
}

const getRecorderInstance = (): VoiceRecorder => {
    return SoundStudioApplicationFactory.getAudioRecorderInstance()!;
};

let isReady = false;

export const AudioRecorderProvider: FC<AudioRecorderProviderProps> = ({ children }) => {
    // State: true if the recorder is ready (the user has allowed access to microphone)
    const [audioRecorderReady, setAudioRecorderReady] = useState(false);
    // State: true if there are an error (when allowing acces to microphone)
    const [audioRecorderHasError, setAudioRecorderHasError] = useState(false);
    // State: true if there are an error (microphone not found)
    const [audioRecorderDeviceNotFound, setAudioRecorderDeviceNotFound] = useState(false);
    // State: true if there are an error (unknown error)
    const [audioRecorderHasUnknownError, setAudioRecorderHasUnknownError] = useState(false);
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
        if (isReady) {
            return;
        }

        getRecorderInstance().on(EventType.RECORDER_ERROR, () => setAudioRecorderHasError(true));
        getRecorderInstance().on(EventType.RECORDER_NOT_FOUND_ERROR, () => setAudioRecorderDeviceNotFound(true));
        getRecorderInstance().on(EventType.RECORDER_UNKNOWN_ERROR, () => setAudioRecorderHasUnknownError(true));
        getRecorderInstance().on(EventType.RECORDER_RECORDING, () => setAudioRecording(true));
        getRecorderInstance().on(EventType.RECORDER_PAUSED, () => setAudioRecording(false));
        getRecorderInstance().on(EventType.RECORDER_UPDATE_CONSTRAINTS, () => setRecorderSettings(getRecorderInstance().getSettings()));
        getRecorderInstance().on(EventType.RECORDER_RESETED, () => resetRecorderState());

        getRecorderInstance().on(EventType.RECORDER_COUNT_UPDATE, () => {
            setRecorderDisplayTime(getRecorderInstance().currentTimeDisplay);
            setRecorderTime(getRecorderInstance().currentTime);
        });

        getRecorderInstance().on(EventType.RECORDER_STOPPED, () => {
            setAudioRecording(false);
            setAudioRecorderReady(false);
        });

        getRecorderInstance().on(EventType.RECORDER_SUCCESS, () => {
            setAudioRecorderReady(true);
            setAudioRecorderHasError(false);
            resetRecorderState();
        });

        setRecorderUnavailable(!getRecorderInstance().isRecordingAvailable());

        isReady = true;
    }, []);

    const initRecorder = async () => {
        try {
            setAudioRecorderAuthorizationPending(true);
            await getRecorderInstance().init();
            setAudioRecorderAuthorizationPending(false);
            setRecorderSettings(getRecorderInstance().getSettings());
        } catch (e) {
            console.error(e);
            setAudioRecorderAuthorizationPending(false);
        }
    };

    const resetRecorderState = () => {
        setAudioRecording(false);
        setRecorderDisplayTime(getRecorderInstance().currentTimeDisplay);
        setRecorderTime(getRecorderInstance().currentTime);
        setRecorderSettings(getRecorderInstance().getSettings());
    };

    const exitAudioRecorder = () => {
        getRecorderInstance().reset();
        setAudioRecorderReady(false);
    };

    const recordAudio = () => getRecorderInstance().record();
    const pauseRecorderAudio = () => getRecorderInstance().pause();
    const stopRecordAudio = () => getRecorderInstance().stop();
    const changeInput = (deviceId: string, groupId: string | undefined) => getRecorderInstance().changeInput(deviceId, groupId);
    const toggleAudioFeedback = (enable: boolean) => getRecorderInstance().audioFeedback(enable);
    const toggleEchoCancellation = (enable: boolean) => getRecorderInstance().setEchoCancellation(enable);
    const toggleNoiseReduction = (enable: boolean) => getRecorderInstance().setNoiseSuppression(enable);
    const toggleAutoGainControl = (enable: boolean) => getRecorderInstance().setAutoGain(enable);

    const closeAudioRecorderError = () => setAudioRecorderHasError(false);
    const closeAudioRecorderDeviceNotFound = () => setAudioRecorderDeviceNotFound(false);
    const closeAudioRecorderUnknownError = () => setAudioRecorderHasUnknownError(false);

    return (
        <AudioRecorderContext.Provider value={{
            audioRecorderReady, audioRecorderHasError, initRecorder, audioRecorderAuthorizationPending,
            closeAudioRecorderError, audioRecording, recordAudio, pauseRecorderAudio, stopRecordAudio,
            recorderDisplayTime, exitAudioRecorder, recorderTime, recorderSettings, changeInput,
            toggleAudioFeedback, toggleEchoCancellation, toggleNoiseReduction, toggleAutoGainControl,
            recorderUnavailable, audioRecorderDeviceNotFound, closeAudioRecorderDeviceNotFound,
            audioRecorderHasUnknownError, closeAudioRecorderUnknownError
        }}>
            {children}
        </AudioRecorderContext.Provider>
    );
};
