"use client";

import React, { createContext, useContext, useState, ReactNode, FC } from 'react';
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
  changeFilterSettings: (filterId: string, settings: any) => void
}

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

// Construct an audio editor instance - singleton
const audioEditorInstance = new AudioEditor();

export const AudioEditorProvider: FC<AudioEditorProviderProps> = ({ children }) => {
  const [loadingPrincipalBuffer, setLoadingPrincipalBuffer] = useState(false);
  const [audioEditorReady, setAudioEditorReady] = useState(false);
  const [audioProcessing, setAudioProcessing] = useState(false);
  const [filterState, setFilterState] = useState(audioEditorInstance.getFiltersState());
  const [bufferPlaying, setBufferPlaying] = useState(false);
  const [playerState, setPlayerState] = useState(audioEditorInstance.getPlayerState());
  const [filtersSettings, setFiltersSettings] = useState(audioEditorInstance.getFiltersSettings());

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

  audioEditorInstance.setOnPlayingFinished(() => setBufferPlaying(false));
  audioEditorInstance.setOnPlayerUpdate(() => setPlayerState(audioEditorInstance.getPlayerState()));
  audioEditorInstance.setOnPlayerStarted(() => setPlayerState(audioEditorInstance.getPlayerState()));

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
  }

  return (
    <AudioEditorContext.Provider value={{
      audioEditorInstance, loadAudioPrincipalBuffer, audioEditorReady, loadingPrincipalBuffer, audioProcessing, toggleFilter, filterState, bufferPlaying,
      playAudioBuffer, pauseAudioBuffer, playerState, validateSettings, exitAudioEditor, loopAudioBuffer, setTimePlayer, filtersSettings, changeFilterSettings
    }}>
      {children}
    </AudioEditorContext.Provider>
  );
};