import { useTranslation } from "react-i18next";
import { useAudioEditor } from "@eliastik/simple-sound-studio-components";
import { useEffect, useRef } from "react";

const LoadingAppDialog = () => {
    const { t } = useTranslation();
    const downloadingInitialData = useAudioEditor(state => state.downloadingInitialData);
    const dialogRef = useRef<HTMLDialogElement | null>(null);
                    
    useEffect(() => {
        const dialog = dialogRef.current;
        if(!dialog) return;

        if(downloadingInitialData && !dialog.open) {
            dialog.showModal();
        } else if(!downloadingInitialData && dialog.open) {
            dialog.close();
        }
    }, [downloadingInitialData]);
    
    return (
        <dialog ref={dialogRef} className="modal" open>
            <div className="modal-box">
                <h3 className="font-bold text-lg">{t("dialogs.loadingApp.title")}</h3>
                <p className="py-4 flex items-center"><span className="loading loading-spinner loading-lg mr-4 text-primary"></span> {t("dialogs.pleaseWait")}</p>
            </div>
        </dialog>
    );
};

export default LoadingAppDialog;
