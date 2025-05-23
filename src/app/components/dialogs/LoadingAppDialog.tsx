import { useTranslation } from "react-i18next";
import { useAudioEditor } from "@eliastik/simple-sound-studio-components";

const LoadingAppDialog = () => {
    const { t } = useTranslation();
    const downloadingInitialData = useAudioEditor(state => state.downloadingInitialData);
    
    return (
        <>
            {downloadingInitialData && <input type="checkbox" id="loadingDataModal" className="modal-toggle" defaultChecked={true} />}
            <div className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">{t("dialogs.loadingApp.title")}</h3>
                    <p className="py-4 flex items-center"><span className="loading loading-spinner loading-lg mr-4 text-primary"></span> {t("dialogs.pleaseWait")}</p>
                </div>
            </div>
        </>
    );
};

export default LoadingAppDialog;
