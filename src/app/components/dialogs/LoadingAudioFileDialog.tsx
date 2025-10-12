import { useTranslation } from "react-i18next";
import { useAudioEditor } from "@eliastik/simple-sound-studio-components";
import { useEffect, useRef } from "react";

const LoadingAudioFileDialog = () => {
    const { t } = useTranslation();
    const loadingPrincipalBuffer = useAudioEditor(state => state.loadingPrincipalBuffer);
    const dialogRef = useRef<HTMLDialogElement | null>(null);
                        
    useEffect(() => {
        const dialog = dialogRef.current;
        if(!dialog) return;

        if(loadingPrincipalBuffer && !dialog.open) {
            dialog.showModal();
        } else if(!loadingPrincipalBuffer && dialog.open) {
            dialog.close();
        }
    }, [loadingPrincipalBuffer]);
    
    return (
        <dialog ref={dialogRef} className="modal">
            <div className="modal-box">
                <h3 className="font-bold text-lg">{t("dialogs.loadingAudioFile.title")}</h3>
                <p className="py-4 flex items-center"><span className="loading loading-spinner loading-lg mr-4 text-primary"></span> {t("dialogs.pleaseWait")}</p>
            </div>
        </dialog>
    );
};

export default LoadingAudioFileDialog;
