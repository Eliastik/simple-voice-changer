import { useApplicationConfig } from "@/app/context/ApplicationConfigContext";
import { useTranslation } from "react-i18next";
import i18next from 'i18next';
import { useAudioEditor } from "@/app/context/AudioEditorContext";
import { useEffect } from "react";

const AppConfigDialog = () => {
  const { currentThemeValue, setTheme, currentLanguageValue, setLanguage } = useApplicationConfig();
  const { isCompatibilityModeEnabled, toggleCompatibilityMode } = useAudioEditor();
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
              <select className="select select-bordered md:w-4/6" id="colorTheme" value={currentThemeValue} onChange={e => setTheme(e.target.value)}>
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
          <div className="mt-3">
            <div className="font-normal text-base flex flex-col md:flex-row gap-3 md:items-center justify-between">
              <div className="md:w-3/6">
                <label htmlFor="compatibilityMode">{t("appSettings.compatibilityMode")}</label>
              </div>
              <div className="flex flex-row gap-x-2">
                <input type="checkbox" className="toggle" id="compatibilityMode" checked={isCompatibilityModeEnabled} onChange={(e) => toggleCompatibilityMode(e.target.checked)} />
                <div className="tooltip tooltip-left" data-tip={t("appSettings.compatibilityModeInfos")}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                  </svg>
                </div>
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

export default AppConfigDialog;