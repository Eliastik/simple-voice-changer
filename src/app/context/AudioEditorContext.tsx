"use client";

import { createContext, useContext, useState, ReactNode, FC, useEffect } from "react";
import AudioEditor from "../classes/AudioEditor";
import AudioEditorContextProps from "../model/contextProps/AudioEditorContextProps";
import AudioEditorPlayerSingleton from "./ApplicationObjectsSingleton";
import { EventType } from "../classes/model/EventTypeEnum";
import BufferPlayer from "../classes/BufferPlayer";

// Construct an audio editor instance - singleton
let audioEditorInstance: AudioEditor;
let audioPlayerInstance: BufferPlayer;

const AudioEditorContext = createContext<AudioEditorContextProps | undefined>(undefined);

export const useAudioEditor = (): AudioEditorContextProps => {
    const context = useContext(AudioEditorContext);
    if (!context) {
        throw new Error("useAudioEditor doit être utilisé à l'intérieur d'un AudioEditorProvider");
    }
    return context;
};

interface AudioEditorProviderProps {
    children: ReactNode;
}

export const AudioEditorProvider: FC<AudioEditorProviderProps> = ({ children }) => {
    // State: true when we are loading audio provided by the user
    const [loadingPrincipalBuffer, setLoadingPrincipalBuffer] = useState(false);
    // State: true when there is an error loading audio provided by the user
    const [errorLoadingPrincipalBuffer, setErrorLoadingPrincipalBuffer] = useState(false);
    // State: true if the audio edtior is ready to be used
    const [audioEditorReady, setAudioEditorReady] = useState(false);
    // State: true when an audio processing is in progress
    const [audioProcessing, setAudioProcessing] = useState(false);
    // State: true when there is an error processing audio
    const [errorProcessingAudio, setErrorProcessingAudio] = useState(false);
    // State: object with enabled state for the filters
    const [filterState, setFilterState] = useState({});
    // State: object with all the settings of the filters
    const [filtersSettings, setFiltersSettings] = useState(new Map());
    // State: true if we are loading initial audio buffer from the network (when starting the application)
    const [downloadingInitialData, setDownloadingInitialData] = useState(true);
    // State: true if we are loading audio buffer from network (used for the reverb filter)
    const [downloadingBufferData, setDownloadingBufferData] = useState(false);
    // State: true if there are error loading buffer data
    const [errorDownloadingBufferData, setErrorDownloadingBufferData] = useState(false);
    // State: true if edited audio buffer of the is being downloaded
    const [downloadingAudio, setDownloadingAudio] = useState(false);
    // State: true if compatibility/direct mode is enabled
    const [isCompatibilityModeEnabled, setCompatibilityModeEnabled] = useState(false);
    // State: true if compatibility/direct was auto enabled
    const [isCompatibilityModeAutoEnabled, setCompatibilityModeAutoEnabled] = useState(false);
    // State:current real sample rate
    const [actualSampleRate, setActualSampleRate] = useState(0);

    useEffect(() => {
        if (audioEditorInstance != null) {
            return;
        }

        audioEditorInstance = AudioEditorPlayerSingleton.getAudioEditorInstance()!;
        audioPlayerInstance = AudioEditorPlayerSingleton.getAudioPlayerInstance()!;

        audioEditorInstance.on(EventType.LOADING_BUFFERS, () => setDownloadingInitialData(true));
        audioEditorInstance.on(EventType.LOADING_BUFFERS_ERROR, () => setDownloadingInitialData(false));
        audioEditorInstance.on(EventType.FETCHING_BUFFERS, () => setDownloadingBufferData(true));

        audioEditorInstance.on(EventType.LOADED_BUFFERS, () => {
            setDownloadingInitialData(false);
            setFiltersSettings(audioEditorInstance.getFiltersSettings());
        });

        audioEditorInstance.on(EventType.FINISHED_FETCHING_BUFFERS, () => {
            setDownloadingBufferData(false);
            setFiltersSettings(audioEditorInstance.getFiltersSettings());
        });

        audioEditorInstance.on(EventType.FETCHING_BUFFERS_ERROR, () => {
            setDownloadingBufferData(false);
            setErrorDownloadingBufferData(true);
        });

        audioEditorInstance.on(EventType.COMPATIBILITY_MODE_AUTO_ENABLED, () => {
            setCompatibilityModeAutoEnabled(true);

            setTimeout(() => {
                setCompatibilityModeAutoEnabled(false);
            }, 10000);
        });

        audioEditorInstance.on(EventType.RECORDER_STOPPED, (buffer: AudioBuffer) => loadAudioPrincipalBuffer(null, buffer));
        audioEditorInstance.on(EventType.SAMPLE_RATE_CHANGED, (currentSampleRate: number) => setActualSampleRate(currentSampleRate));

        setDownloadingInitialData(audioEditorInstance.downloadingInitialData);
        setFilterState(audioEditorInstance.getFiltersState());
        setFiltersSettings(audioEditorInstance.getFiltersSettings());
        setCompatibilityModeEnabled(audioEditorInstance.isCompatibilityModeEnabled());
    }, []);

    const loadAudioPrincipalBuffer = async (file: File | null, audioBuffer?: AudioBuffer) => {
        setLoadingPrincipalBuffer(true);

        try {
            if (file) {
                await audioEditorInstance.loadBufferFromFile(file);
            } else if (audioBuffer) {
                audioEditorInstance.loadBuffer(audioBuffer);
            } else {
                throw new Error("No audio file or audio buffer!");
            }

            setLoadingPrincipalBuffer(false);
            setAudioEditorReady(true);

            await processAudio();

            setCompatibilityModeEnabled(audioEditorInstance.isCompatibilityModeEnabled());
        } catch (e) {
            console.error(e);
            setLoadingPrincipalBuffer(false);
            setErrorLoadingPrincipalBuffer(true);
        }
    };

    const toggleFilter = (filterId: string) => {
        audioEditorInstance.toggleFilter(filterId);
        setFilterState(audioEditorInstance.getFiltersState());
    };

    const processAudio = async () => {
        try {
            setErrorProcessingAudio(false);
            setAudioProcessing(true);
            await audioEditorInstance.renderAudio();
            setAudioProcessing(false);
        } catch (e) {
            console.error(e);
            setAudioProcessing(false);
            setErrorProcessingAudio(true);
        }
    };

    const validateSettings = async () => processAudio();

    const exitAudioEditor = () => {
        audioEditorInstance.exit();
        setAudioEditorReady(false);
    };

    const changeFilterSettings = async (filterId: string, settings: any) => {
        await audioEditorInstance.changeFilterSettings(filterId, settings);
        setFiltersSettings(audioEditorInstance.getFiltersSettings());
    };

    const resetFilterSettings = (filterId: string) => {
        audioEditorInstance.resetFilterSettings(filterId);
        setFiltersSettings(audioEditorInstance.getFiltersSettings());
    };

    const resetAllFiltersState = () => {
        audioEditorInstance.resetAllFiltersState();
        setFilterState(audioEditorInstance.getFiltersState());
    };

    const closeErrorLoadingPrincipalBuffer = () => setErrorLoadingPrincipalBuffer(false);
    const closeErrorDownloadingBufferData = () => setErrorDownloadingBufferData(false);
    const closeErrorProcessingAudio = () => setErrorProcessingAudio(false);

    const downloadAudio = async () => {
        setDownloadingAudio(true);
        await audioEditorInstance.saveBuffer();
        setDownloadingAudio(false);
    };

    const toggleCompatibilityMode = (enabled: boolean) => {
        if (audioEditorInstance) {
            if (enabled) {
                audioEditorInstance.enableCompatibilityMode();
            } else {
                audioEditorInstance.disableCompatibilityMode();
            }

            setCompatibilityModeEnabled(enabled);
        }
    };

    const pauseAudioEditor = () => audioPlayerInstance.pause();

    return (
        <AudioEditorContext.Provider value={{
            audioEditorInstance, loadAudioPrincipalBuffer, audioEditorReady, loadingPrincipalBuffer, audioProcessing, toggleFilter, filterState, validateSettings,
            exitAudioEditor, filtersSettings, changeFilterSettings, resetFilterSettings, downloadingInitialData, downloadingBufferData, errorLoadingPrincipalBuffer, closeErrorLoadingPrincipalBuffer,
            errorDownloadingBufferData, closeErrorDownloadingBufferData, downloadAudio, downloadingAudio, resetAllFiltersState, isCompatibilityModeEnabled, toggleCompatibilityMode,
            isCompatibilityModeAutoEnabled, pauseAudioEditor, errorProcessingAudio, closeErrorProcessingAudio, actualSampleRate
        }}>
            {children}
        </AudioEditorContext.Provider>
    );
};
