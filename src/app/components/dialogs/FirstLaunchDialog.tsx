import { useApplicationConfig } from "@/app/context/ApplicationConfigContext";
import Constants from "@/app/model/Constants";
import { useTranslation } from "react-i18next";

const FirstLaunchDialog = () => {
    const { t } = useTranslation();
    const { closeFirstLaunchModal } = useApplicationConfig();
    const { alreadyUsed } = useApplicationConfig();

    return (
        <>
            {!alreadyUsed && <input type="checkbox" id="modalFirstLaunch" className="modal-toggle" defaultChecked={true} />}
            <div className="modal">
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
            </div>
        </>
    );
};

export default FirstLaunchDialog;
