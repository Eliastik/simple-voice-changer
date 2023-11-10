"use client";

import { createContext, useContext, useState, ReactNode, FC, useEffect } from 'react';
import AudioEditorPlayerSingleton from './AudioObjectsSingleton';
import AudioRecorderContextProps from './AudioRecorderContextProps';
import VoiceRecorder from '../classes/VoiceRecorder';
import { EventType } from '../classes/model/EventTypeEnum';

let audioRecorderInstance: VoiceRecorder;

const AudioRecorderContext = createContext<AudioRecorderContextProps | undefined>(undefined);

export const useAudioRecorder = (): AudioRecorderContextProps => {
  const context = useContext(AudioRecorderContext);
  if (!context) {
    throw new Error('useAudioRecorder doit être utilisé à l\'intérieur d\'un AudioRecorderProvider');
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

  useEffect(() => {
    if (audioRecorderInstance != null) {
      return;
    }

    audioRecorderInstance = AudioEditorPlayerSingleton.getAudioRecorderInstance()!;

    audioRecorderInstance.on(EventType.RECORDER_ERROR, () => setAudioRecorderHasError(true));
    audioRecorderInstance.on(EventType.RECORDER_SUCCESS, () => {
      setAudioRecorderReady(true);
      setAudioRecorderHasError(false);
    });
  }, []);

  const initRecorder = async () => {
    setAudioRecorderAuthorizationPending(true);
    await audioRecorderInstance.init();
    setAudioRecorderAuthorizationPending(false);
  };

  const closeAudioRecorderError = () => setAudioRecorderHasError(false);

  return (
    <AudioRecorderContext.Provider value={{
      audioRecorderReady, audioRecorderHasError, initRecorder, audioRecorderAuthorizationPending,
      closeAudioRecorderError
    }}>
      {children}
    </AudioRecorderContext.Provider>
  );
};