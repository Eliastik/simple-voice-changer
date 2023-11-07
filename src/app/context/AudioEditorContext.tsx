"use client";

import { createContext, useContext, useState, ReactNode, FC, useEffect } from 'react';
import AudioEditor from '../classes/AudioEditor';
import utils from "../classes/utils/Functions";
import AudioEditorContextProps from './AudioEditorContextProps';
import Constants from '../model/Constants';
import AudioEditorPlayerSingleton from './AudioEditorPlayerSingleton';

// Construct an audio editor instance - singleton
let audioEditorInstance: AudioEditor;

const AudioEditorContext = createContext<AudioEditorContextProps | undefined>(undefined);

export const useAudioEditor = (): AudioEditorContextProps => {
  const context = useContext(AudioEditorContext);
  if (!context) {
    throw new Error('useAudioEditor doit être utilisé à l\'intérieur d\'un AudioEditorProvider');
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

  useEffect(() => {
    if(audioEditorInstance != null) {
      return;
    }

    audioEditorInstance = AudioEditorPlayerSingleton.getAudioEditorInstance()!;

    audioEditorInstance.on("loadingBuffers", () => setDownloadingInitialData(true));
    audioEditorInstance.on("fetchingBuffer", () => setDownloadingBufferData(true));
  
    audioEditorInstance.on("loadedBuffers", () => {
      setDownloadingInitialData(false);
      setFiltersSettings(audioEditorInstance.getFiltersSettings());
    });
  
    audioEditorInstance.on("finishedFetchingBuffer", () => {
      setDownloadingBufferData(false);
      setFiltersSettings(audioEditorInstance.getFiltersSettings());
    });
  
    audioEditorInstance.on("fetchingBufferError", () => {
      setDownloadingBufferData(false);
      setErrorDownloadingBufferData(true);
    });
  
    audioEditorInstance.on("compatibilityModeAutoEnabled", () => {
      setCompatibilityModeAutoEnabled(true);

      setTimeout(() => {
        setCompatibilityModeAutoEnabled(false);
      }, 10000);
    });

    setDownloadingInitialData(audioEditorInstance.downloadingInitialData);
    setFilterState(audioEditorInstance.getFiltersState());
    setFiltersSettings(audioEditorInstance.getFiltersSettings());
    setCompatibilityModeEnabled(audioEditorInstance.isCompatibilityModeEnabled());
  }, []);

  const loadAudioPrincipalBuffer = async (file: File) => {
    setLoadingPrincipalBuffer(true);

    try {
      const buffer = await utils.loadAudioBuffer(file);
      audioEditorInstance.principalBuffer = buffer;
  
      setLoadingPrincipalBuffer(false);
      setAudioEditorReady(true);
  
      setAudioProcessing(true);
      await audioEditorInstance.renderAudio();
      setAudioProcessing(false);
      setCompatibilityModeEnabled(audioEditorInstance.isCompatibilityModeEnabled());
    } catch(e) {
      console.error(e);
      setLoadingPrincipalBuffer(false);
      setErrorLoadingPrincipalBuffer(true);
    }
  };

  const toggleFilter = (filterId: string) => {
    audioEditorInstance.toggleFilter(filterId);
    setFilterState(audioEditorInstance.getFiltersState());
  };

  const validateSettings = async () => {
    setAudioProcessing(true);
    await audioEditorInstance.renderAudio();
    setAudioProcessing(false);
  };

  const exitAudioEditor = () => {
    audioEditorInstance.exit();
    setAudioEditorReady(false);
  };

  const changeFilterSettings = (filterId: string, settings: any) => {
    audioEditorInstance.changeFilterSettings(filterId, settings);
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
  const downloadAudio = async () => {
    setDownloadingAudio(true);
    await audioEditorInstance.saveBuffer();
    setDownloadingAudio(false);
  };

  const toggleCompatibilityMode = (enabled: boolean) => {
    if(audioEditorInstance) {
      if(enabled) {
        audioEditorInstance.enableCompatibilityMode();
      } else {
        audioEditorInstance.disableCompatibilityMode();
      }
  
      setCompatibilityModeEnabled(enabled);
    }
  };

  return (
    <AudioEditorContext.Provider value={{
      audioEditorInstance, loadAudioPrincipalBuffer, audioEditorReady, loadingPrincipalBuffer, audioProcessing, toggleFilter, filterState, validateSettings,
      exitAudioEditor, filtersSettings, changeFilterSettings, resetFilterSettings, downloadingInitialData, downloadingBufferData, errorLoadingPrincipalBuffer, closeErrorLoadingPrincipalBuffer,
      errorDownloadingBufferData, closeErrorDownloadingBufferData, downloadAudio, downloadingAudio, resetAllFiltersState, isCompatibilityModeEnabled, toggleCompatibilityMode,
      isCompatibilityModeAutoEnabled
    }}>
      {children}
    </AudioEditorContext.Provider>
  );
};