import { useTranslation } from "react-i18next";
import Constants from "@/app/model/Constants";
import { useApplicationConfig } from "@/app/context/ApplicationConfigContext";

const AppInfoDialog = () => {
  const { t } = useTranslation();
  const { currentLanguageValue } = useApplicationConfig();

  return (
    <dialog id="modalInfos" className="modal">
      <div className="modal-box overflow-visible">
        <h3 className="font-bold text-lg">{t("appInfos.title")}</h3>
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>
        <div className="flex flex-col">
          <div className="mt-3">
            <div className="font-light text-sm flex flex-col md:flex-row gap-3 md:items-center justify-between">
              <div className="w-full">
                <span>{t("appInfos.infos")}</span>
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
              <a href={Constants.release_link} className="link link-info hover:no-underline" target="_blank">{Constants.app_version}</a>
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="mt-3">
            <div className="font-normal text-base flex flex-col md:flex-row gap-3 md:items-center justify-between">
              <div className="md:w-4/6">
                <label>{t("appInfos.versionDate")}</label>
              </div>
              {(new Date(Constants.app_version_date)).toLocaleDateString(currentLanguageValue)}
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="mt-3">
            <div className="font-normal text-base flex flex-col md:flex-row gap-3 md:items-center justify-between">
              <div className="md:w-4/6">
                <label>{t("appInfos.license")}</label>
              </div>
              {Constants.app_license}
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
                <a href={Constants.official_website} className="link link-info hover:no-underline" target="_blank">{Constants.official_website}</a>
                <a href={Constants.souce_code} className="link link-info hover:no-underline" target="_blank">{Constants.souce_code}</a>
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