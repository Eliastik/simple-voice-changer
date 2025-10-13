import { useAudioEditor, useAudioPlayer } from "@eliastik/simple-sound-studio-components";
import { useTranslation } from "react-i18next";
import { useShallow } from "zustand/shallow";

const AudioPlayerLoopOneAudioButton = () => {
    
    const { t } = useTranslation();
    
    const audioFilesCount = useAudioEditor(useShallow(state => state.audioFilesCount));

    const [
        loopAudioBuffer,
        looping
    ] = useAudioPlayer(useShallow(state => [
        state.loopAudioBuffer,
        state.looping
    ]));

    return (
        <div className="tooltip" data-tip={audioFilesCount > 1 ? t("audioPlayer.loopMultipleFile") : t("audioPlayer.loop")}>
            <button className={`btn btn-ghost pr-2 pl-2 md:pr-4 md:pl-4 ${looping ? "bg-secondary text-black" : ""}`} id="loopPlayingButton" onClick={() => loopAudioBuffer()}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path d="m16.023 9.3484h4.9926v-0.00178m-18.031 10.298v-4.9927m0 0h4.9926m-4.9926 0 3.1809 3.183c0.99053 0.9924 2.2476 1.7453 3.6993 2.1343 4.401 1.1793 8.9248-1.4326 10.104-5.8337m-15.938-4.2705c1.1793-4.4011 5.703-7.0129 10.104-5.8336 1.4517 0.38899 2.7088 1.1419 3.6993 2.1343l3.1812 3.1811m0-4.9908v4.9908" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                    <g fill="currentColor" stroke="currentColor" strokeWidth="1px" aria-label="1">
                        <path d="m10.295 15.168h1.7333v-6.1227q0-0.18133 0.016-0.384l-1.664 1.4773q-0.07467 0.064-0.14933 0.048-0.07467-0.016-0.11733-0.064l-0.15467-0.21333 2.1813-1.9253h0.4v7.184h1.648v0.39467h-3.8933z"/>
                    </g>
                </svg>
            </button>
        </div>
    );
};

export default AudioPlayerLoopOneAudioButton;
