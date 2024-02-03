import { useAudioRecorder } from "@/app/context/AudioRecorderContext";
import { useTranslation } from "react-i18next";

const AudioRecorderAuthorizationDialog = () => {
    const { t } = useTranslation();
    const { audioRecorderAuthorizationPending } = useAudioRecorder();

    return (
        <>
            {audioRecorderAuthorizationPending && <input type="checkbox" id="audioRecorderAuthorizationDialog" className="modal-toggle" defaultChecked={true} />}
            <div className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">{t("dialogs.audioRecorderAuthorization.title")}</h3>
                    <p className="py-4 flex items-center gap-x-4">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 stroke-yellow-500 flex-shrink-0">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                        </svg>
                        <span className="flex-shrink">{t("dialogs.audioRecorderAuthorization.info")}</span>
                    </p>
                </div>
            </div>
        </>
    );
};

export default AudioRecorderAuthorizationDialog;
