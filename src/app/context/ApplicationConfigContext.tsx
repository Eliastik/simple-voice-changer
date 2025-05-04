"use client";

import { create } from "zustand/react";
import i18n from "@eliastik/simple-sound-studio-components/lib/i18n";
import i18next from "i18next";
import { EventType, Constants, EventEmitter } from "@eliastik/simple-sound-studio-lib";
import { SoundStudioApplicationFactory } from "@eliastik/simple-sound-studio-components";
import ApplicationConfigService from "./ApplicationConfigService";
import ApplicationConfigSingleton from "./ApplicationConfigSingleton";
import ApplicationConfigContextProps from "../model/contextProps/ApplicationConfigContextProps";

const getService = (): ApplicationConfigService | undefined => ApplicationConfigSingleton.getConfigServiceInstance();
const getEventEmitter = (): EventEmitter | null => SoundStudioApplicationFactory.getEventEmitterInstance();

export const useApplicationConfig = create<ApplicationConfigContextProps>((set, get) => {
    const initializeStore = () => {
        if (get().isInitialized) {
            return;
        }

        const service = getService();
        const emitter = getEventEmitter();

        if (service && emitter) {
            set({
                currentTheme: service.getCurrentTheme(),
                currentThemeValue: service.getCurrentThemePreference(),
                alreadyUsed: service.hasAlreadyUsedApp(),
                isAudioWorkletEnabled: service.isAudioWorkletEnabled(),
                isSoundtouchAudioWorkletEnabled: service.isSoundtouchAudioWorkletEnabled(),
                bufferSize: service.getBufferSize(),
                sampleRate: service.getSampleRate(),
                bitrateMP3: service.getBitrateMP3(),
                isCompatibilityModeEnabled: service.isCompatibilityModeEnabled(),
                isInitialRenderingEnabled: !service.isInitialRenderingDisabled(),
            });
    
            emitter.on(EventType.COMPATIBILITY_MODE_AUTO_ENABLED, () => {
                set({ isCompatibilityModeEnabled: true });
            });
    
            service.checkAppUpdate().then(result => set({ updateData: result }));

            set({ isInitialized: true });
        } else {
            console.error("ConfigService or EventEmitter is not available!");
        }
    };

    return {
        isInitialized: false,
        currentTheme: "dark",
        currentThemeValue: "auto",
        currentLanguageValue: "en",
        updateData: null,
        alreadyUsed: false,
        isAudioWorkletEnabled: false,
        isSoundtouchAudioWorkletEnabled: false,
        bufferSize: 0,
        sampleRate: 0,
        bitrateMP3: Constants.DEFAULT_MP3_BITRATE,
        isCompatibilityModeEnabled: false,
        isInitialRenderingEnabled: false,
        setTheme: (theme) => {
            const service = getService();
            
            if (service) {
                service.setCurrentTheme(theme);

                set({
                    currentTheme: service.getCurrentTheme(),
                    currentThemeValue: service.getCurrentThemePreference(),
                });
            }
        },
        setupLanguage: () => {
            const service = getService();

            if (service) {
                const lng = service.getCurrentLanguagePreference();
                i18next.changeLanguage(lng);
                i18n.i18next.changeLanguage(lng);

                set({ currentLanguageValue: lng });
            }
        },
        setLanguage: (lng) => {
            const service = getService();
            
            if (service) {
                service.setCurrentLanguage(lng);
                get().setupLanguage();
            }
        },
        closeFirstLaunchModal: () => {
            const service = getService();
            
            if (service) {
                service.setAlreadyUsedApp();
                set({ alreadyUsed: true });
            }
        },
        toggleAudioWorklet: (enabled) => {
            const service = getService();
            
            if (service) {
                service.enableAudioWorklet(enabled);
                set({ isAudioWorkletEnabled: enabled });
            }
        },
        toggleSoundtouchAudioWorklet: (enabled) => {
            const service = getService();
            
            if (service) {
                service.enableSoundtouchAudioWorklet(enabled);
                set({ isSoundtouchAudioWorkletEnabled: enabled });
            }
        },
        changeBufferSize: (size) => {
            const service = getService();
            
            if (service) {
                service.setBufferSize(size);
                set({ bufferSize: size });
            }
        },
        changeSampleRate: (frequency) => {
            const service = getService();

            if (service) {
                service.setSampleRate(frequency);
                set({ sampleRate: frequency });
            }
        },
        updateCurrentTheme: () => {
            const { currentThemeValue } = get();
            const service = getService();

            if (currentThemeValue === "auto" && service) {
                set({ currentTheme: service.getCurrentTheme() });
            }
        },
        toggleCompatibilityMode: (enabled) => {
            const service = getService();

            if (service) {
                if(enabled) {
                    service.enableCompatibilityMode();
                } else {
                    service.disableCompatibilityMode()
                }

                set({ isCompatibilityModeEnabled: enabled });
            }
        },
        toggleEnableInitialRendering: (enabled) => {
            const service = getService();
            
            if (service) {
                service.toggleInitialRendering(enabled);
                set({ isInitialRenderingEnabled: enabled });
            }
        },
        changeBitrateMP3: (bitrate) => {
            const service = getService();
            
            if (service) {
                service.setBitrateMP3(bitrate);
                set({ bitrateMP3: bitrate });
            }
        },
        initializeStore
    };
});
