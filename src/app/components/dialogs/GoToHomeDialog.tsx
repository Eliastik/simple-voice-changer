import { useAudioEditor } from "@eliastik/simple-sound-studio-components";
import { useAudioRecorder } from "@/app/context/AudioRecorderContext";
import { useTranslation } from "react-i18next";

const GoToHomeDialog = () => {
    const { audioEditorReady, exitAudioEditor } = useAudioEditor();
    const { audioRecorderReady, exitAudioRecorder } = useAudioRecorder();
    const { t } = useTranslation();

    return (
        <dialog id="modalGoToHome" className="modal">
            <div className="modal-box">
                <h3 className="font-bold text-lg">{t("dialogs.goToHome.title")}</h3>
                <form method="dialog">
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                </form>
                <p className="py-4">{t("dialogs.goToHome.info")}</p>
                <div className="modal-action">
                    <form method="dialog">
                        <button className="btn btn-neutral mr-2" onClick={() => {
                            if(audioEditorReady) {
                                exitAudioEditor();
                            }

                            if(audioRecorderReady) {
                                exitAudioRecorder();
                            }
                        }}>{t("ok")}</button>
                        <button className="btn">{t("cancel")}</button>
                    </form>
                </div>
            </div>
        </dialog>
    );
};

export default GoToHomeDialog;
