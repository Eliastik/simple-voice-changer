import { useAudioEditor, useAudioPlayer } from "@eliastik/simple-sound-studio-components";
import { useTranslation } from "react-i18next";
import { useShallow } from "zustand/shallow";

const AudioPlayerLoopButton = () => {
    
    const { t } = useTranslation();
    
    const audioFilesCount = useAudioEditor(useShallow(state => state.audioFilesCount));

    const [
        loopAudioBuffer,
        looping,
        loopingAll,
        loopAllAudioBuffer
    ] = useAudioPlayer(useShallow(state => [
        state.loopAudioBuffer,
        state.looping,
        state.loopingAll,
        state.loopAllAudioBuffer
    ]));

    return (
        <div className="tooltip" data-tip={audioFilesCount > 1 ? t("audioPlayer.loopMultipleFile") : t("audioPlayer.loop")}>
            <button className={`btn btn-ghost pr-2 pl-2 md:pr-4 md:pl-4 ${(loopingAll || (audioFilesCount <= 1 && looping)) ? "bg-secondary text-black " : ""}`} id="loopPlayingButton" onClick={() => {
                if (audioFilesCount > 1 && !loopingAll) {
                    loopAllAudioBuffer();
                } else {
                    loopAudioBuffer();
                }
            }}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
            </button>
        </div>
    );
};

export default AudioPlayerLoopButton;
