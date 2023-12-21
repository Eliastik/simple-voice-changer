export default interface AudioPlayerContextProps {
    playing: boolean,
    playAudioBuffer: () => void,
    pauseAudioBuffer: () => void,
    loopAudioBuffer: () => void,
    setTimePlayer: (percent: number) => void,
    isCompatibilityModeEnabled: boolean,
    stopAudioBuffer: () => void,
    currentTimeDisplay: string,
    maxTimeDisplay: string,
    percent: number,
    looping: boolean,
    currentTime: number,
    maxTime: number
};
