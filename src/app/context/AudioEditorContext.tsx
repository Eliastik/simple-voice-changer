"use client";

import { createContext, useContext, useState, ReactNode, FC, useEffect } from 'react';
import AudioEditor from '../classes/AudioEditor';
import utils from "../classes/utils/Functions";
import AudioEditorContextProps from './AudioEditorContextProps';

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
  // State: true if the audio player is playing the audio
  const [bufferPlaying, setBufferPlaying] = useState(false);
  // State: state of the audio player (time etc.)
  const [playerState, setPlayerState] = useState(audioEditorInstance && audioEditorInstance.getPlayerState());
  // State: object with all the settings of the filters
  const [filtersSettings, setFiltersSettings] = useState(new Map());
  // State: true if we are loading initial audio buffer from the network (when starting the application)
  const [downloadingInitialData, setDownloadingInitialData] = useState(false);
  // State: true if we are loading audio buffer from network (used for the reverb filter)
  const [downloadingBufferData, setDownloadingBufferData] = useState(false);
  // State: true if there are error loading buffer data
  const [errorDownloadingBufferData, setErrorDownloadingBufferData] = useState(false);
  // State: true if edited audio buffer of the is being downloaded
  const [downloadingAudio, setDownloadingAudio] = useState(false);

  useEffect(() => {
    if(audioEditorInstance != null) {
      return;
    }

    audioEditorInstance = new AudioEditor(new AudioContext());

    audioEditorInstance.on("playingFinished", () => setBufferPlaying(false));
    audioEditorInstance.on("playingUpdate", () => setPlayerState(audioEditorInstance.getPlayerState()));
    audioEditorInstance.on("playingStarted", () => setPlayerState(audioEditorInstance.getPlayerState()));
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

    setDownloadingInitialData(audioEditorInstance.downloadingInitialData);
    setFilterState(audioEditorInstance.getFiltersState());
    setPlayerState(audioEditorInstance.getPlayerState());
    setFiltersSettings(audioEditorInstance.getFiltersSettings());
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

  const playAudioBuffer = () => {
    audioEditorInstance.playBuffer();
    setBufferPlaying(true);
  };

  const pauseAudioBuffer = () => {
    audioEditorInstance.pauseBuffer();
    setBufferPlaying(false);
  };

  const loopAudioBuffer = () => {
    audioEditorInstance.toggleLoopPlayer();
    setPlayerState(audioEditorInstance.getPlayerState());
  };

  const setTimePlayer = (percent: number) => {
    audioEditorInstance.setPlayerTime(percent);
  };

  const validateSettings = async () => {
    setBufferPlaying(false);
    setAudioProcessing(true);
    await audioEditorInstance.renderAudio();
    setAudioProcessing(false);
  };

  const exitAudioEditor = () => {
    audioEditorInstance.exit();
    setAudioEditorReady(false);
    setBufferPlaying(false);
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

  return (
    <AudioEditorContext.Provider value={{
      audioEditorInstance, loadAudioPrincipalBuffer, audioEditorReady, loadingPrincipalBuffer, audioProcessing, toggleFilter, filterState, bufferPlaying,
      playAudioBuffer, pauseAudioBuffer, playerState, validateSettings, exitAudioEditor, loopAudioBuffer, setTimePlayer, filtersSettings, changeFilterSettings,
      resetFilterSettings, downloadingInitialData, downloadingBufferData, errorLoadingPrincipalBuffer, closeErrorLoadingPrincipalBuffer, errorDownloadingBufferData,
      closeErrorDownloadingBufferData, downloadAudio, downloadingAudio, resetAllFiltersState
    }}>
      {children}
    </AudioEditorContext.Provider>
  );
};