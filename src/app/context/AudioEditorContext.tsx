"use client";

import React, { createContext, useContext, useState, ReactNode, FC, useEffect } from 'react';
import AudioEditor from '../classes/AudioEditor';
import utils from "../classes/utils/Functions";

interface AudioEditorContextProps {
  audioEditorInstance: AudioEditor;
  loadAudioPrincipalBuffer: (buffer: File) => void;
  audioEditorReady: boolean,
  loadingPrincipalBuffer: boolean,
  audioProcessing: boolean
  toggleFilter: (filterId: string) => void,
  filterState: any,
  bufferPlaying: boolean,
  playAudioBuffer: () => void,
  pauseAudioBuffer: () => void,
  playerState: any,
  validateSettings: () => void,
  exitAudioEditor: () => void,
  loopAudioBuffer: () => void,
  setTimePlayer: (percent: number) => void,
  filtersSettings: Map<string, any>,
  changeFilterSettings: (filterId: string, settings: any) => void,
  resetFilterSettings: (filterId: string) => void,
  downloadingInitialData: boolean,
  downloadingBufferData: boolean
}

// Construct an audio editor instance - singleton
const audioEditorInstance = new AudioEditor();

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
  const [loadingPrincipalBuffer, setLoadingPrincipalBuffer] = useState(false);
  const [audioEditorReady, setAudioEditorReady] = useState(false);
  const [audioProcessing, setAudioProcessing] = useState(false);
  const [filterState, setFilterState] = useState(audioEditorInstance.getFiltersState());
  const [bufferPlaying, setBufferPlaying] = useState(false);
  const [playerState, setPlayerState] = useState(audioEditorInstance.getPlayerState());
  const [filtersSettings, setFiltersSettings] = useState(audioEditorInstance.getFiltersSettings());
  const [downloadingInitialData, setDownloadingInitialData] = useState(audioEditorInstance.downloadingInitialData);
  const [downloadingBufferData, setDownloadingBufferData] = useState(false);

  useEffect(() => {
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
  }, []);

  const loadAudioPrincipalBuffer = async (file: File) => {
    setLoadingPrincipalBuffer(true);

    const buffer = await utils.loadAudioBuffer(file);
    audioEditorInstance.principalBuffer = buffer;

    setLoadingPrincipalBuffer(false);
    setAudioEditorReady(true);

    setAudioProcessing(true);
    await audioEditorInstance.renderAudio();
    setAudioProcessing(false);
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

  return (
    <AudioEditorContext.Provider value={{
      audioEditorInstance, loadAudioPrincipalBuffer, audioEditorReady, loadingPrincipalBuffer, audioProcessing, toggleFilter, filterState, bufferPlaying,
      playAudioBuffer, pauseAudioBuffer, playerState, validateSettings, exitAudioEditor, loopAudioBuffer, setTimePlayer, filtersSettings, changeFilterSettings,
      resetFilterSettings, downloadingInitialData, downloadingBufferData
    }}>
      {children}
    </AudioEditorContext.Provider>
  );
};