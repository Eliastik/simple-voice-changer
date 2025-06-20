import { useTranslation } from "react-i18next";
import { useShallow } from "zustand/shallow";
import { useApplicationConfig } from "@/app/context/ApplicationConfigContext";
import { useAudioEditor } from "@eliastik/simple-sound-studio-components";

const AudioPlayerDownloadButton = () => {
    
    const { t } = useTranslation();
    
    const downloadAudio = useAudioEditor(useShallow(state => state.downloadAudio));
    const bitrateMP3 = useApplicationConfig(useShallow(state => state.bitrateMP3));
    
    const removeOpenAttribute = () => {
        document.querySelector("#dropdownDownloadAudio")?.removeAttribute("open");
        document.querySelector("#dropdownVolume")?.removeAttribute("open");
        return true;
    };

     return (
        <div className="tooltip tooltip-left" data-tip={t("audioPlayer.save")}>
            <details className="dropdown dropdown-top dropdown-end" id="dropdownDownloadAudio">
                <summary role="button" className="btn btn-ghost pr-2 pl-2 md:pr-4 md:pl-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                </summary>
                <ul className="p-2 shadow-sm menu dropdown-content z-1 bg-base-100 rounded-box w-52">
                    <li onClick={() => removeOpenAttribute() && downloadAudio({ format: "mp3", bitrate: bitrateMP3 })}><a>{t("audioPlayer.saveToMp3")}</a></li>
                    <li onClick={() => removeOpenAttribute() && downloadAudio({ format: "wav" })}><a>{t("audioPlayer.saveToWav")}</a></li>
                </ul>
            </details>
        </div>
    );
};

export default AudioPlayerDownloadButton;
