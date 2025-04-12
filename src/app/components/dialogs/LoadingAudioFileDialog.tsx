import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useAudioEditor } from "@eliastik/simple-sound-studio-components";

const LoadingAudioFileDialog = () => {
    const { t } = useTranslation();
    const { loadingPrincipalBuffer } = useAudioEditor();
                                            
    const loadingPrincipalBufferCheckbox = useMemo(() => {
        if (loadingPrincipalBuffer) {
            return <input type="checkbox" id="loadingBufferModal" className="modal-toggle" defaultChecked={true} />;
        } else {
            return <></>
        }
    }, [loadingPrincipalBuffer]);
    
    return (
        <>
            {loadingPrincipalBufferCheckbox}
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
