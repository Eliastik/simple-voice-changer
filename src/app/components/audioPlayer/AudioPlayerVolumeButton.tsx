import { useAudioPlayer } from "@eliastik/simple-sound-studio-components";
import { useTranslation } from "react-i18next";
import { useShallow } from "zustand/shallow";

const AudioPlayerVolumeButton = () => {
    
    const { t } = useTranslation();

    const [
        audioVolume,
        setVolume
    ] = useAudioPlayer(useShallow(state => [
        state.audioVolume,
        state.setVolume
    ]));

     return (
        <div className="tooltip tooltip-top" data-tip={t("audioPlayer.volume")}>
            <details className="dropdown dropdown-top dropdown-end" id="dropdownVolume">
                <summary role="button" className="btn btn-ghost pr-2 pl-2 md:pr-4 md:pl-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
                    </svg>
                </summary>
                <div className="p-2 shadow-sm menu dropdown-content z-1 bg-base-100 rounded-box h-40 w-14">
                    <input type="range" min={0} max={1} step={0.01} value={audioVolume} className="range range-primary -rotate-90 origin-left absolute -bottom-3 left-7 w-40" onChange={event => setVolume(parseFloat(event.target.value))} />
                </div>
            </details>
        </div>
    );
};

export default AudioPlayerVolumeButton;
