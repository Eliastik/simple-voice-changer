import { DaisyUIModal, useAudioEditor } from "@eliastik/simple-sound-studio-components";
import { useTranslation } from "react-i18next";

const AudioFileListDialog = () => {
    const { t } = useTranslation();
    const { currentFileList, loadAudioFromFileListIndex } = useAudioEditor();

    return (
        <dialog id="modalAudioFileList" className="modal">
            <div className="modal-box">
                <h3 className="font-bold text-lg">{t("dialogs.audioFileListDialog.title")}</h3>
                <form method="dialog">
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                </form>
                <div className="flex flex-col mt-6">
                    <div className="join join-vertical">
                        {
                            Array.from(currentFileList.entries()).map((element, index) => {
                                return (
                                    <button
                                        className={`btn${element[1] ? " btn-primary" : ""} btn-no-uppercase join-item text-left flex flex-row items-center justify-start break-all overflow-hidden`}
                                        key={index}
                                        onClick={() => {
                                            loadAudioFromFileListIndex(index);
                                            (document.getElementById("modalAudioFileList")! as DaisyUIModal).close();
                                        }}
                                    >
                                        {element[1] && 
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                                            </svg>
                                        }
                                        <span className="w-5/6">{element[0]}</span>
                                    </button>
                                );
                            })
                        }
                    </div>
                </div>
                <div className="modal-action">
                    <form method="dialog">
                        <button className="btn">{t("close")}</button>
                    </form>
                </div>
            </div>
        </dialog>
    );
};

export default AudioFileListDialog;
