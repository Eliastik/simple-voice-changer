import { UpdateData } from "../UpdateData";

export default interface ApplicationConfigContextProps {
    currentTheme: string,
    currentThemeValue: string,
    setTheme: (theme: string) => void,
    setupLanguage: () => void,
    currentLanguageValue: string,
    setLanguage: (lng: string) => void,
    updateData: UpdateData | null,
    alreadyUsed: boolean,
    closeFirstLaunchModal: () => void,
    isAudioWorkletEnabled: boolean,
    toggleAudioWorklet: (enabled: boolean) => void,
    isSoundtouchAudioWorkletEnabled: boolean,
    toggleSoundtouchAudioWorklet: (enabled: boolean) => void,
    bufferSize: number,
    changeBufferSize: (size: number) => void,
    sampleRate: number,
    changeSampleRate: (frequency: number) => void,
    updateCurrentTheme: () => void,
    isCompatibilityModeEnabled: boolean,
    toggleCompatibilityMode: (enabled: boolean) => void,
    isInitialRenderingEnabled: boolean,
    toggleEnableInitialRendering: (enabled: boolean) => void,
    bitrateMP3: number,
    changeBitrateMP3: (bitrate: number) => void
};
