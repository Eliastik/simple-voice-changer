import { useAudioPlayer } from "@eliastik/simple-sound-studio-components";
import { useShallow } from "zustand/shallow";

const AudioPlayerRange = () => {
    
    const [
        setTimePlayer,
        maxTime,
        currentTime
    ] = useAudioPlayer(useShallow(state => [
        state.setTimePlayer,
        state.maxTime,
        state.currentTime
    ]));

     return (
        <div className="block w-full">
            <input
                type="range"
                id="audioPlayerProgress"
                min={0}
                max={maxTime}
                value={currentTime}
                className="range range-player range-accent range-sm w-full rounded-none block bg-gray-250 after:bg-gray-800 backdrop-blur-xs"
                onChange={(event) => setTimePlayer(parseFloat(event.target.value))} />
        </div>
    );
};

export default AudioPlayerRange;
