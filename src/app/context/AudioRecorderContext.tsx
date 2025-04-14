"use client";

import { create } from "zustand";
import { createContext, ReactNode, FC } from "react";
import { SoundStudioApplicationFactory } from "@eliastik/simple-sound-studio-components";
import { EventType } from "@eliastik/simple-sound-studio-lib";
import AudioRecorderContextProps from "../model/contextProps/AudioRecorderContextProps";

const getRecorderInstance = () => SoundStudioApplicationFactory.getAudioRecorderInstance();
const getEventEmitter = () => SoundStudioApplicationFactory.getEventEmitterInstance();

export const useAudioRecorder = create<AudioRecorderContextProps>((set, get) => {
    const resetRecorderState = () => {
        const recorder = getRecorderInstance();

        if (recorder) {
            set({
                audioRecording: false,
                recorderDisplayTime: recorder.currentTimeDisplay,
                recorderTime: recorder.currentTime,
                recorderSettings: recorder.getSettings(),
            });
        }
    };

    const initializeStore = () => {
        if (get().isInitialized) {
            return;
        }

        const emitter = getEventEmitter();
        const recorder = getRecorderInstance();

        if (emitter && recorder) {
            emitter.on(EventType.RECORDER_ERROR, () => set({ audioRecorderHasError: true }));
            emitter.on(EventType.RECORDER_NOT_FOUND_ERROR, () => set({ audioRecorderDeviceNotFound: true }));
            emitter.on(EventType.RECORDER_UNKNOWN_ERROR, () => set({ audioRecorderHasUnknownError: true }));
            emitter.on(EventType.RECORDER_RECORDING, () => set({ audioRecording: true }));
            emitter.on(EventType.RECORDER_PAUSED, () => set({ audioRecording: false }));
            emitter.on(EventType.RECORDER_UPDATE_CONSTRAINTS, () => set({ recorderSettings: recorder.getSettings() }));
            emitter.on(EventType.RECORDER_RESETED, resetRecorderState);
            emitter.on(EventType.RECORDER_STOPPED, () => set({ audioRecording: false, audioRecorderReady: false }));

            emitter.on(EventType.RECORDER_COUNT_UPDATE, () => {
                const recorder = getRecorderInstance();

                if (recorder) {
                    set({
                        recorderDisplayTime: recorder.currentTimeDisplay,
                        recorderTime: recorder.currentTime,
                    });
                }
            });

            emitter.on(EventType.RECORDER_SUCCESS, () => {
                resetRecorderState();
                set({
                    audioRecorderReady: true,
                    audioRecorderHasError: false,
                });
            });

            set({ recorderUnavailable: !recorder.isRecordingAvailable() });
    
            get().isInitialized = true;
        } else {
            console.error("Event Emitter or Audio Recorder is not available!");
        }
    };

    return {
        isInitialized: false,
        audioRecorderReady: false,
        audioRecorderHasError: false,
        audioRecorderDeviceNotFound: false,
        audioRecorderHasUnknownError: false,
        audioRecorderAuthorizationPending: false,
        audioRecording: false,
        recorderDisplayTime: "00:00",
        recorderTime: 0,
        recorderSettings: { constraints: {}, deviceList: [], audioFeedback: false },
        recorderUnavailable: false,
        initRecorder: async () => {
            const recorder = getRecorderInstance();

            try {
                if(!recorder) {
                    throw new Error("Recorder is not available!");
                }

                set({ audioRecorderAuthorizationPending: true });
                await recorder.init();
                set({
                    audioRecorderAuthorizationPending: false,
                    recorderSettings: recorder.getSettings(),
                });
            } catch (e) {
                console.error(e);
                set({ audioRecorderAuthorizationPending: false });
            }
        },
        exitAudioRecorder: () => {
            const recorder = getRecorderInstance();

            if (recorder) {
                recorder.reset();
                set({ audioRecorderReady: false });
            }
        },
        recordAudio: () => getRecorderInstance()?.record(),
        pauseRecorderAudio: () => getRecorderInstance()?.pause(),
        stopRecordAudio: () => getRecorderInstance()?.stop(),
        changeInput: (deviceId, groupId) => getRecorderInstance()?.changeInput(deviceId, groupId),
        toggleAudioFeedback: (enable) => getRecorderInstance()?.audioFeedback(enable),
        toggleEchoCancellation: (enable) => getRecorderInstance()?.setEchoCancellation(enable),
        toggleNoiseReduction: (enable) => getRecorderInstance()?.setNoiseSuppression(enable),
        toggleAutoGainControl: (enable) => getRecorderInstance()?.setAutoGain(enable),
        closeAudioRecorderError: () => set({ audioRecorderHasError: false }),
        closeAudioRecorderDeviceNotFound: () => set({ audioRecorderDeviceNotFound: false }),
        closeAudioRecorderUnknownError: () => set({ audioRecorderHasUnknownError: false }),
        initializeStore
    };
});

const AudioRecorderContext = createContext<AudioRecorderContextProps | undefined>(undefined);

interface AudioRecorderProviderProps {
    children: ReactNode;
}

/**
 * @deprecated Will be removed in a future release. It is not needed anymore.
 */
export const AudioRecorderProvider: FC<AudioRecorderProviderProps> = ({ children }) => {
    const audioRecorderStore = useAudioRecorder();

    console.warn("AudioRecorderProvider is deprecated and will be removed in a future release. It is not needed anymore.");
  
    return (
        <AudioRecorderContext.Provider value={audioRecorderStore}>
            {children}
        </AudioRecorderContext.Provider>
    );
};
