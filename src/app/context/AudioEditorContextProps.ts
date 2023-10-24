import AudioEditor from "../classes/AudioEditor";

export default interface AudioEditorContextProps {
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
};