"use client";

import { createContext, useContext, useState, ReactNode, FC, useEffect, useCallback } from "react";
import { AudioEditor, BufferPlayer, EventType, FilterSettings, FilterState } from "@eliastik/simple-sound-studio-lib";
import AudioEditorContextProps from "../model/contextProps/AudioEditorContextProps";
import ApplicationObjectsSingleton from "./ApplicationObjectsSingleton";

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

const getAudioEditor = (): AudioEditor => {
    return ApplicationObjectsSingleton.getAudioEditorInstance()!;
};

const getAudioPlayer = (): BufferPlayer => {
    return ApplicationObjectsSingleton.getAudioPlayerInstance()!;
};

let isReady = false;

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
    const [filterState, setFilterState] = useState<FilterState>({});
    // State: object with all the settings of the filters
    const [filtersSettings, setFiltersSettings] = useState<Map<string, FilterSettings>>(new Map());
    // State: true if we are loading initial audio buffer from the network (when starting the application)
    const [downloadingInitialData, setDownloadingInitialData] = useState(true);
    // State: true if we are loading audio buffer from network (used for the reverb filter)
    const [downloadingBufferData, setDownloadingBufferData] = useState(false);
    // State: true if there are error loading buffer data
    const [errorDownloadingBufferData, setErrorDownloadingBufferData] = useState(false);
    // State: true if edited audio buffer of the is being downloaded
    const [downloadingAudio, setDownloadingAudio] = useState(false);
    // State: current real sample rate
    const [actualSampleRate, setActualSampleRate] = useState(0);
    // State: default device sample rate
    const [defaultDeviceSampleRate, setDefaultDeviceSampleRate] = useState(0);
    // State: true if AudioWorklet is currently available/compatible with the browser
    const [audioWorkletAvailable, setAudioWorkletAvailable] = useState(false);

    const loadAudioPrincipalBuffer = useCallback(async (file: File | null, audioBuffer?: AudioBuffer) => {
        setLoadingPrincipalBuffer(true);

        try {
            if (file) {
                await getAudioEditor().loadBufferFromFile(file);
            } else if (audioBuffer) {
                getAudioEditor().loadBuffer(audioBuffer);
            } else {
                throw new Error("No audio file or audio buffer!");
            }

            setLoadingPrincipalBuffer(false);
            setAudioEditorReady(true);

            await processAudio();
        } catch (e) {
            console.error(e);
            setLoadingPrincipalBuffer(false);
            setErrorLoadingPrincipalBuffer(true);
        }
    }, []);

    useEffect(() => {
        if (isReady) {
            return;
        }

        getAudioEditor().on(EventType.LOADING_BUFFERS, () => setDownloadingInitialData(true));
        getAudioEditor().on(EventType.LOADING_BUFFERS_ERROR, () => setDownloadingInitialData(false));
        getAudioEditor().on(EventType.FETCHING_BUFFERS, () => setDownloadingBufferData(true));

        getAudioEditor().on(EventType.LOADED_BUFFERS, () => {
            setDownloadingInitialData(false);
            setFiltersSettings(getAudioEditor().getFiltersSettings());
        });

        getAudioEditor().on(EventType.FINISHED_FETCHING_BUFFERS, () => {
            setDownloadingBufferData(false);
            setFiltersSettings(getAudioEditor().getFiltersSettings());
        });

        getAudioEditor().on(EventType.FETCHING_BUFFERS_ERROR, () => {
            setDownloadingBufferData(false);
            setErrorDownloadingBufferData(true);
        });

        getAudioEditor().on(EventType.RECORDER_STOPPED, (buffer) => {
            loadAudioPrincipalBuffer(null, buffer as AudioBuffer);
        });

        getAudioEditor().on(EventType.SAMPLE_RATE_CHANGED, (currentSampleRate) => {
            setActualSampleRate(currentSampleRate as number);
        });

        setDownloadingInitialData(getAudioEditor().downloadingInitialData);
        setFilterState(getAudioEditor().getFiltersState());
        setFiltersSettings(getAudioEditor().getFiltersSettings());
        setActualSampleRate(getAudioEditor().currentSampleRate);
        setDefaultDeviceSampleRate(getAudioEditor().defaultDeviceSampleRate);
        setAudioWorkletAvailable(getAudioEditor().isAudioWorkletAvailable());

        isReady = true;
    }, [loadAudioPrincipalBuffer]);

    const toggleFilter = (filterId: string) => {
        getAudioEditor().toggleFilter(filterId);
        setFilterState(getAudioEditor().getFiltersState());
    };

    const processAudio = async () => {
        try {
            setErrorProcessingAudio(false);
            setAudioProcessing(true);
            await getAudioEditor().renderAudio();
            setAudioProcessing(false);
        } catch (e) {
            console.error(e);
            setAudioProcessing(false);
            setErrorProcessingAudio(true);
        }
    };

    const validateSettings = async () => processAudio();

    const exitAudioEditor = () => {
        getAudioEditor().exit();
        setAudioEditorReady(false);
    };

    const changeFilterSettings = async (filterId: string, settings: FilterSettings) => {
        await getAudioEditor().changeFilterSettings(filterId, settings);
        setFiltersSettings(getAudioEditor().getFiltersSettings());
    };

    const resetFilterSettings = (filterId: string) => {
        getAudioEditor().resetFilterSettings(filterId);
        setFiltersSettings(getAudioEditor().getFiltersSettings());
    };

    const resetAllFiltersState = () => {
        getAudioEditor().resetAllFiltersState();
        setFilterState(getAudioEditor().getFiltersState());
    };

    const closeErrorLoadingPrincipalBuffer = () => setErrorLoadingPrincipalBuffer(false);
    const closeErrorDownloadingBufferData = () => setErrorDownloadingBufferData(false);
    const closeErrorProcessingAudio = () => setErrorProcessingAudio(false);

    const downloadAudio = async () => {
        setDownloadingAudio(true);
        await getAudioEditor().saveBuffer();
        setDownloadingAudio(false);
    };

    const pauseAudioEditor = () => getAudioPlayer().pause();

    return (
        <AudioEditorContext.Provider value={{
            loadAudioPrincipalBuffer, audioEditorReady, loadingPrincipalBuffer, audioProcessing, toggleFilter, filterState, validateSettings,
            exitAudioEditor, filtersSettings, changeFilterSettings, resetFilterSettings, downloadingInitialData, downloadingBufferData, errorLoadingPrincipalBuffer,
            closeErrorLoadingPrincipalBuffer, errorDownloadingBufferData, closeErrorDownloadingBufferData, downloadAudio, downloadingAudio, resetAllFiltersState,
            pauseAudioEditor, errorProcessingAudio, closeErrorProcessingAudio, actualSampleRate, defaultDeviceSampleRate, audioWorkletAvailable
        }}>
            {children}
        </AudioEditorContext.Provider>
    );
};
