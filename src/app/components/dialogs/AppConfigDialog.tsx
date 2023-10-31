import { useApplicationConfig } from "@/app/context/ApplicationConfigContext";
import { useTranslation } from "react-i18next";
import i18next from 'i18next';

const AppConfigDialog = () => {
  const { currentThemeValue, setTheme, currentLanguageValue, setLanguage } = useApplicationConfig();
  const { t } = useTranslation();

  return (
    <dialog id="modalSettings" className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">{t("appSettings.title")}</h3>
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>
        <div className="flex flex-col">
          <div className="mt-3">
            <div className="font-normal text-base flex flex-col md:flex-row gap-3 md:items-center justify-between">
              <div className="md:w-4/6">
                <label htmlFor="colorTheme">{t("appSettings.colorTheme")}</label>
              </div>
              <select className="select select-bordered md:w-4/6"id="colorTheme" value={currentThemeValue} onChange={e => setTheme(e.target.value)}>
                <option value="auto">{t("appSettings.colorThemeAuto")}</option>
                <option value="light">{t("appSettings.colorThemeLight")}</option>
                <option value="dark">{t("appSettings.colorThemeDark")}</option>
              </select>
            </div>
          </div>
          <div className="mt-3">
            <div className="font-normal text-base flex flex-col md:flex-row gap-3 md:items-center justify-between">
              <div className="md:w-4/6">
                <label htmlFor="selectLanguage">{t("appSettings.language")}</label>
              </div>
              <select className="select select-bordered md:w-4/6" id="selectLanguage" value={currentLanguageValue} onChange={e => setLanguage(e.target.value)}>
                {i18next.languages.map(language => {
                  return <option value={language} key={language}>{t("languages." + language)}</option>;
                })}
              </select>
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

export default AppConfigDialog;