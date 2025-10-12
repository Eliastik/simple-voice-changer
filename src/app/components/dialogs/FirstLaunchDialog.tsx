import { useTranslation } from "react-i18next";
import { useApplicationConfig } from "@/app/context/ApplicationConfigContext";
import Constants from "@/app/model/Constants";
import { useEffect, useRef } from "react";

const FirstLaunchDialog = () => {
    const { t } = useTranslation();
    const dialogRef = useRef<HTMLDialogElement | null>(null);
    
    const closeFirstLaunchModal = useApplicationConfig(state => state.closeFirstLaunchModal);
    const alreadyUsed = useApplicationConfig(state => state.alreadyUsed);
                
    useEffect(() => {
        const dialog = dialogRef.current;
        if(!dialog) return;

        if(!alreadyUsed && !dialog.open) {
            dialog.showModal();
        } else if(alreadyUsed && dialog.open) {
            dialog.close();
        }
    }, [alreadyUsed]);

    return (
        <dialog ref={dialogRef} className="modal">
            <div className="modal-box">
                <h3 className="font-bold text-lg">{t("firstLaunch.title")}</h3>
                <form method="dialog">
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={() => closeFirstLaunchModal()}>✕</button>
                </form>
                <div className="flex flex-col">
                    <div className="mt-3">
                        <div className="flex flex-col md:flex-row gap-3 md:items-center justify-between">
                            <div className="w-full">
                                <span>{t("appInfos.infos", { appName: Constants.APP_NAME })}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="modal-action">
                    <form method="dialog">
                        <button className="btn" onClick={() => closeFirstLaunchModal()}>{t("ok")}</button>
                    </form>
                </div>
            </div>
        </dialog>
    );
};

export default FirstLaunchDialog;
