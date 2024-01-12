"use client";

import { createContext, useContext, useState, ReactNode, FC, useEffect } from "react";
import { AudioEditor, EventType } from "@eliastik/simple-sound-studio-lib";
import { ApplicationObjectsSingleton } from "@eliastik/simple-sound-studio-components";
import i18n from "@eliastik/simple-sound-studio-components/lib/i18n";
import i18next from "i18next";
import ApplicationConfigContextProps from "../model/contextProps/ApplicationConfigContextProps";
import ApplicationConfigService from "./ApplicationConfigService";
import { UpdateData } from "../model/UpdateData";
import ApplicationConfigSingleton from "./ApplicationConfigSingleton";

const ApplicationConfigContext = createContext<ApplicationConfigContextProps | undefined>(undefined);

export const useApplicationConfig = (): ApplicationConfigContextProps => {
    const context = useContext(ApplicationConfigContext);
    if (!context) {
        throw new Error("useApplicationConfig doit être utilisé à l'intérieur d'un ApplicationConfigProvider");
    }
    return context;
};

interface ApplicationConfigProviderProps {
    children: ReactNode;
}

const getService = (): ApplicationConfigService => {
    return ApplicationConfigSingleton.getConfigServiceInstance()!;
};

const getAudioEditor = (): AudioEditor => {
    return ApplicationObjectsSingleton.getAudioEditorInstance()!;
};

let isReady = false;

export const ApplicationConfigProvider: FC<ApplicationConfigProviderProps> = ({ children }) => {
    // State: current theme (light/dark)
    const [currentTheme, setCurrentTheme] = useState("dark");
    // State: theme setting (auto/dark/light)
    const [currentThemeValue, setCurrentThemeValue] = useState("auto");
    // State: current language
    const [currentLanguageValue, setCurrentLanguageValue] = useState("en");
    // State: current language
    const [updateData, setUpdateData] = useState<UpdateData | null>(null);
    // State: true if the user already used the time one time
    const [alreadyUsed, setAlreadyUsed] = useState(false);
    // State: audio worklet enabled/disabled
    const [isAudioWorkletEnabled, setAudioWorkletEnabled] = useState(false);
    // State: audio worklet enabled/disabled
    const [isSoundtouchAudioWorkletEnabled, setSoundtouchAudioWorkletEnabled] = useState(false);
    // State: buffer size
    const [bufferSize, setBufferSize] = useState(0);
    // State: sample rate
    const [sampleRate, setSampleRate] = useState(0);
    // State: true if compatibility/direct mode is enabled
    const [isCompatibilityModeEnabled, setCompatibilityModeEnabled] = useState(false);
    // State: true if compatibility/direct was auto enabled
    const [isCompatibilityModeAutoEnabled, setCompatibilityModeAutoEnabled] = useState(false);
    // State: true if there is a problem rendering audio (same problem that auto enable compatibility mode)
    const [hasProblemRenderingAudio, setHasProblemRenderingAudio] = useState(false);

    useEffect(() => {
        if (isReady) {
            return;
        }

        setCurrentTheme(getService().getCurrentTheme());
        setCurrentThemeValue(getService().getCurrentThemePreference());
        setAlreadyUsed(getService().hasAlreadyUsedApp());
        setAudioWorkletEnabled(getService().isAudioWorkletEnabled());
        setSoundtouchAudioWorkletEnabled(getService().isSoundtouchAudioWorkletEnabled());
        setBufferSize(getService().getBufferSize());
        setSampleRate(getService().getSampleRate());
        setCompatibilityModeEnabled(getService().isCompatibilityModeEnabled());

        getAudioEditor().on(EventType.COMPATIBILITY_MODE_AUTO_ENABLED, () => {
            setCompatibilityModeAutoEnabled(true);
            setCompatibilityModeEnabled(true);

            setTimeout(() => {
                setCompatibilityModeAutoEnabled(false);
            }, 10000);
        });

        getAudioEditor().on(EventType.RENDERING_AUDIO_PROBLEM_DETECTED, () => {
            setHasProblemRenderingAudio(true);

            setTimeout(() => {
                setHasProblemRenderingAudio(false);
            }, 10000);
        });

        getService().checkAppUpdate().then(result => setUpdateData(result));

        isReady = true;
    }, []);

    const setTheme = (theme: string) => {
        getService().setCurrentTheme(theme);
        setCurrentTheme(getService().getCurrentTheme());
        setCurrentThemeValue(getService().getCurrentThemePreference());
    };

    const setupLanguage = () => {
        const lng = getService().getCurrentLanguagePreference();
        i18next.changeLanguage(lng);
        i18n.i18next.changeLanguage(lng);
        setCurrentLanguageValue(lng);
    };

    const setLanguage = (lng: string) => {
        getService().setCurrentLanguage(lng);
        setupLanguage();
    };

    const closeFirstLaunchModal = () => {
        getService().setAlreadyUsedApp();
        setAlreadyUsed(true);
    };

    const toggleAudioWorklet = (enabled: boolean) => {
        getService().enableAudioWorklet(enabled);
        setAudioWorkletEnabled(enabled);
    };

    const toggleSoundtouchAudioWorklet = (enabled: boolean) => {
        getService().enableSoundtouchAudioWorklet(enabled);
        setSoundtouchAudioWorkletEnabled(enabled);
    };

    const changeBufferSize = (size: number) => {
        getService().setBufferSize(size);
        setBufferSize(size);
    };

    const changeSampleRate = (frequency: number) => {
        getService().setSampleRate(frequency);
        setSampleRate(frequency);
    };

    const updateCurrentTheme = () => {
        if (currentThemeValue === "auto") {
            setCurrentTheme(getService().getCurrentTheme());
        }
    };

    const toggleCompatibilityMode = (enabled: boolean) => {
        if (enabled) {
            getService().enableCompatibilityMode();
        } else {
            getService().disableCompatibilityMode();
        }

        setCompatibilityModeEnabled(enabled);
    };

    return (
        <ApplicationConfigContext.Provider value={{
            currentTheme, currentThemeValue, setTheme, setupLanguage, currentLanguageValue, setLanguage,
            updateData, alreadyUsed, closeFirstLaunchModal, isAudioWorkletEnabled, toggleAudioWorklet,
            isSoundtouchAudioWorkletEnabled, toggleSoundtouchAudioWorklet, bufferSize, changeBufferSize,
            sampleRate, changeSampleRate, updateCurrentTheme, isCompatibilityModeEnabled,
            toggleCompatibilityMode, isCompatibilityModeAutoEnabled, hasProblemRenderingAudio
        }}>
            {children}
        </ApplicationConfigContext.Provider>
    );
};
