import { useTranslation } from "react-i18next";
import Constants from "@/app/model/Constants";
import { useApplicationConfig } from "@/app/context/ApplicationConfigContext";

const AppInfoDialog = () => {
    const { t } = useTranslation();
    const { currentLanguageValue } = useApplicationConfig();
    const { updateData } = useApplicationConfig();

    return (
        <dialog id="modalInfos" className="modal">
            <div className="modal-box">
                <h3 className="font-bold text-lg">{t("appInfos.title")}</h3>
                <form method="dialog">
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                </form>
                <div className="flex flex-col">
                    <div className="mt-3">
                        <div className="font-light text-sm flex flex-col md:flex-row gap-3 md:items-center justify-between">
                            <div className="w-full">
                                <span>{t("appInfos.infos", { appName: Constants.APP_NAME })}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col">
                    <div className="mt-3">
                        <div className="font-normal text-base flex flex-col md:flex-row gap-3 md:items-center justify-between">
                            <div className="md:w-4/6">
                                <label>{t("appInfos.appVersion")}</label>
                            </div>
                            <a href={Constants.RELEASE_LINK} className="link link-info hover:no-underline" target="_blank">{Constants.APP_VERSION}</a>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col">
                    <div className="mt-3">
                        <div className="font-normal text-base">
                            {updateData && !updateData.hasUpdate && (
                                <div className="text-success flex flex-row items-center gap-x-2 md:justify-end">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 flex-shrink-0">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>{t("appInfos.upToDate")}</span>
                                </div>
                            )}
                            {updateData && updateData.hasUpdate && (
                                <div className="text-error flex flex-row items-center gap-x-2 md:justify-end">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 flex-shrink-0">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>{t("appInfos.updateAvailable", { version: updateData.version, versionDate: new Date(updateData.date).toLocaleDateString(currentLanguageValue) })} <a href={updateData.url} target="_blank" className="link hover:no-underline">{t("appInfos.moreInfos")}</a></span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex flex-col">
                    <div className="mt-3">
                        <div className="font-normal text-base flex flex-col md:flex-row gap-3 md:items-center justify-between">
                            <div className="md:w-4/6">
                                <label>{t("appInfos.versionDate")}</label>
                            </div>
                            {(new Date(Constants.APP_VERSION_DATE)).toLocaleDateString(currentLanguageValue)}
                        </div>
                    </div>
                </div>
                <div className="flex flex-col">
                    <div className="mt-3">
                        <div className="font-normal text-base flex flex-col md:flex-row gap-3 md:items-center justify-between">
                            <div className="md:w-4/6">
                                <label>{t("appInfos.license")}</label>
                            </div>
                            {Constants.APP_LICENSE}
                        </div>
                    </div>
                </div>
                <div className="flex flex-col">
                    <div className="mt-3">
                        <div className="font-normal text-base flex flex-col md:flex-row gap-3 md:items-center justify-between">
                            <div className="md:w-full">
                                <label>{t("appInfos.websites")}</label>
                            </div>
                            <div className="flex flex-col gap-y-4">
                                <a href={Constants.OFFICIAL_WEBSITE} className="link link-info hover:no-underline" target="_blank">{Constants.OFFICIAL_WEBSITE}</a>
                                <a href={Constants.SOURCE_CODE} className="link link-info hover:no-underline" target="_blank">{Constants.SOURCE_CODE}</a>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="modal-action">
                    <form method="dialog">
                        <button className="btn">{t("close")}</button>
                    </form>
                </div>
            </div>
        </dialog>
    );
};

export default AppInfoDialog;
