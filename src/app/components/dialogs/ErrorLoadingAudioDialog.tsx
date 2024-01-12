import { useAudioEditor } from "@eliastik/simple-sound-studio-components";
import { useTranslation } from "react-i18next";

const ErrorLoadingAudioDialog = () => {
    const { errorLoadingPrincipalBuffer, closeErrorLoadingPrincipalBuffer } = useAudioEditor();
    const { t } = useTranslation();

    return (
        <>
            <input type="checkbox" id="errorLoadingAudioDialog" className="modal-toggle" checked={errorLoadingPrincipalBuffer} readOnly />
            <div className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">{t("dialogs.fileOpenError.title")}</h3>
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={() => closeErrorLoadingPrincipalBuffer()}>✕</button>
                    </form>
                    <div className="flex flex-col">
                        <div className="mt-3">
                            <p className="py-4 flex items-center gap-x-4">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 stroke-red-500 flex-shrink-0">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="flex-shrink">{t("dialogs.fileOpenError.info")}</span>
                            </p>
                        </div>
                    </div>
                    <div className="modal-action mt-0">
                        <form method="dialog">
                            <button className="btn" onClick={() => closeErrorLoadingPrincipalBuffer()}>{t("ok")}</button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ErrorLoadingAudioDialog;
