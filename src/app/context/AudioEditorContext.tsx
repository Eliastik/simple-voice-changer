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
  filterState: any
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

export const AudioEditorProvider: FC<AudioEditorProviderProps> = ({ children }) => {
  const [audioEditorInstance, setAudioEditorInstance] = useState(new AudioEditor());
  const [loadingPrincipalBuffer, setLoadingPrincipalBuffer] = useState(false);
  const [audioEditorReady, setAudioEditorReady] = useState(false);
  const [audioProcessing, setAudioProcessing] = useState(false);
  const [filterState, setFilterState] = useState(audioEditorInstance.getFiltersState());

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

  return (
    <AudioEditorContext.Provider value={{ audioEditorInstance, loadAudioPrincipalBuffer, audioEditorReady, loadingPrincipalBuffer, audioProcessing, toggleFilter, filterState }}>
      {children}
    </AudioEditorContext.Provider>
  );
};