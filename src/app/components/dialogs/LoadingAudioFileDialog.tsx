import { useAudioEditor } from "@eliastik/simple-sound-studio-components";
import { useTranslation } from "react-i18next";

const LoadingAudioFileDialog = () => {
    const { t } = useTranslation();
    const { loadingPrincipalBuffer } = useAudioEditor();
    
    return (
        <>
            {loadingPrincipalBuffer && <input type="checkbox" id="loadingBufferModal" className="modal-toggle" defaultChecked={true} />}
            <div className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">{t("dialogs.loadingAudioFile.title")}</h3>
                    <p className="py-4 flex items-center"><span className="loading loading-spinner loading-lg mr-4 text-primary"></span> {t("dialogs.pleaseWait")}</p>
                </div>
            </div>
        </>
    );
};

export default LoadingAudioFileDialog;
