import AudioEditor from "../../classes/AudioEditor";

export default interface AudioEditorContextProps {
    audioEditorInstance: AudioEditor;
    loadAudioPrincipalBuffer: (buffer: File) => void;
    audioEditorReady: boolean,
    loadingPrincipalBuffer: boolean,
    audioProcessing: boolean
    toggleFilter: (filterId: string) => void,
    filterState: any,
    validateSettings: () => void,
    exitAudioEditor: () => void,
    filtersSettings: Map<string, any>,
    changeFilterSettings: (filterId: string, settings: any) => void,
    resetFilterSettings: (filterId: string) => void,
    downloadingInitialData: boolean,
    downloadingBufferData: boolean,
    errorLoadingPrincipalBuffer: boolean,
    closeErrorLoadingPrincipalBuffer: () => void,
    errorDownloadingBufferData: boolean,
    closeErrorDownloadingBufferData: () => void,
    downloadAudio: () => void,
    downloadingAudio: boolean,
    resetAllFiltersState: () => void,
    isCompatibilityModeEnabled: boolean,
    toggleCompatibilityMode: (enabled: boolean) => void,
    isCompatibilityModeAutoEnabled: boolean,
    pauseAudioEditor: () => void,
    errorProcessingAudio: boolean,
    closeErrorProcessingAudio: () => void,
    actualSampleRate: number,
    defaultDeviceSampleRate: number
};
