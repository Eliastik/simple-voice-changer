import { useAudioEditor } from "@eliastik/simple-sound-studio-components/lib";;
import { useTranslation } from "react-i18next";

const DownloadingBufferDialog = () => {
    const { t } = useTranslation();
    const { downloadingBufferData } = useAudioEditor();
    
    return (
        <>
            <input type="checkbox" id="loadingDataModal" className="modal-toggle" checked={downloadingBufferData} readOnly />
            <div className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">{t("dialogs.bufferDownloading.title")}</h3>
                    <p className="py-4 flex items-center"><span className="loading loading-spinner loading-lg mr-4 text-info"></span> {t("dialogs.pleaseWait")}</p>
                </div>
            </div>
        </>
    );
};

export default DownloadingBufferDialog;
