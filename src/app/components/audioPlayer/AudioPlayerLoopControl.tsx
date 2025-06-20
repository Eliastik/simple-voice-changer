import { useShallow } from "zustand/shallow";
import { useAudioEditor, useAudioPlayer } from "@eliastik/simple-sound-studio-components";
import AudioPlayerLoopButton from "./AudioPlayerLoopButton";
import AudioPlayerLoopOneAudioButton from "./AudioPlayerLoopOneAudioButton";

const AudioPlayerLoopControl = () => {
    
    const audioFilesCount = useAudioEditor(useShallow(state => state.audioFilesCount));
    const looping = useAudioPlayer(useShallow(state => state.looping));

    return (
        <>
            {audioFilesCount <= 1 && (
                <AudioPlayerLoopButton></AudioPlayerLoopButton>
            )}
            {audioFilesCount > 1 && !looping && (
                <AudioPlayerLoopButton></AudioPlayerLoopButton>
            )}
            {audioFilesCount > 1 && looping && (
                <AudioPlayerLoopOneAudioButton></AudioPlayerLoopOneAudioButton>
            )}
        </>
    );
};

export default AudioPlayerLoopControl;
