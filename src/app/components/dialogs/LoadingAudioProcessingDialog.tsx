import { useAudioEditor } from "@eliastik/simple-sound-studio-components/lib";;
import { useTranslation } from "react-i18next";

const LoadingAudioProcessingDialog = () => {
    const { t } = useTranslation();
    const { audioProcessing } = useAudioEditor();
    
    return (
        <>
            <input type="checkbox" id="loadingAudioProcessing" className="modal-toggle" checked={audioProcessing} readOnly />
            <div className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">{t("dialogs.processing.title")}</h3>
                    <p className="py-4 flex items-center"><span className="loading loading-spinner loading-lg mr-4 text-info"></span> {t("dialogs.pleaseWait")}</p>
                </div>
            </div>
        </>
    );
};

export default LoadingAudioProcessingDialog;
