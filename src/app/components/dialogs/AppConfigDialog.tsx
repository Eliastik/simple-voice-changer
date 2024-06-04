import { Constants } from "@eliastik/simple-sound-studio-lib";
import { useAudioEditor } from "@eliastik/simple-sound-studio-components";
import { useApplicationConfig } from "@/app/context/ApplicationConfigContext";
import { useTranslation } from "react-i18next";
import i18next from "i18next";

const AppConfigDialog = () => {
    const {
        currentThemeValue,
        setTheme,
        currentLanguageValue,
        setLanguage,
        isAudioWorkletEnabled,
        toggleAudioWorklet,
        isSoundtouchAudioWorkletEnabled,
        toggleSoundtouchAudioWorklet,
        bufferSize,
        changeBufferSize,
        sampleRate,
        changeSampleRate,
        isCompatibilityModeEnabled,
        toggleCompatibilityMode,
        isInitialRenderingEnabled,
        toggleEnableInitialRendering,
        bitrateMP3,
        changeBitrateMP3
    } = useApplicationConfig();
    const { actualSampleRate, defaultDeviceSampleRate, audioWorkletAvailable } = useAudioEditor();
    const { t } = useTranslation();

    const InfoIcon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
    </svg>;

    const ErrorIcon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>;

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
                            <div className="flex flex-row gap-x-2 justify-center md:justify-items-end">
                                <input type="checkbox" className="toggle" id="compatibilityMode" checked={isCompatibilityModeEnabled} onChange={(e) => toggleCompatibilityMode(e.target.checked)} />
                                <div className="tooltip tooltip-top tooltip-config-dialog md:tooltip-config-dialog-md" data-tip={t("appSettings.compatibilityModeInfos")}>
                                    {InfoIcon}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-3">
                        <div className="font-normal text-base flex flex-col md:flex-row gap-3 md:items-center justify-between">
                            <div className="md:w-3/6">
                                <label htmlFor="enableInitialRendering">{t("appSettings.enableInitialRendering")}</label>
                            </div>
                            <div className="flex flex-row gap-x-2 justify-center md:justify-items-end">
                                <input type="checkbox" className="toggle" id="enableInitialRendering" checked={isInitialRenderingEnabled} onChange={(e) => toggleEnableInitialRendering(e.target.checked)} />
                                <div className="tooltip tooltip-top tooltip-config-dialog md:tooltip-config-dialog-md" data-tip={t("appSettings.enableInitialRenderingInfos")}>
                                    {InfoIcon}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col mt-4 -m-1">
                    <div className="collapse collapse-arrow border border-base-300 bg-base-200 overflow-visible">
                        <input type="checkbox" className="peer" />
                        <div className="collapse-title text-md">
                            {(t("appSettings.advanced"))}
                        </div>
                        <div className="collapse-content flex flex-col overflow-visible">
                            <div className="mt-3">
                                <div className="font-normal text-base flex flex-col md:flex-row gap-3 md:items-center justify-between">
                                    <div className="md:w-3/6">
                                        <label htmlFor="samplingFrequencySelect">{t("appSettings.samplingFrequency")}</label>
                                    </div>
                                    <div className="flex flex-col">
                                        <div className="flex flex-row gap-x-2 items-center justify-end">
                                            <select className="select select-bordered flex-1" id="samplingFrequencySelect" value={sampleRate} onChange={(e) => changeSampleRate(parseInt(e.target.value))}>
                                                {Constants.VALID_SAMPLE_RATES.map(frequency =>
                                                    <option value={frequency} key={frequency}>
                                                        {frequency != 0 ? new Intl.NumberFormat(currentLanguageValue).format(frequency) : t("appSettings.defaultSampleRate")} {frequency > 0 && t("appSettings.sampleRateHz")}
                                                    </option>
                                                )}
                                            </select>
                                            {sampleRate > defaultDeviceSampleRate && (
                                                <div className="tooltip tooltip-top tooltip-config-dialog-input md:tooltip-config-dialog-md text-warning" data-tip={t("appSettings.samplingFrequencyTooHigh")}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                                                    </svg>
                                                </div>
                                            )}
                                            <div className="tooltip tooltip-top tooltip-config-dialog-input md:tooltip-config-dialog-md" data-tip={t("appSettings.samplingFrequencyInfo")}>
                                                {InfoIcon}
                                            </div>
                                        </div>
                                        {actualSampleRate > 0 && <div className="justify-end text-xs mt-2">{t("appSettings.actualSampleRate")} {new Intl.NumberFormat(currentLanguageValue).format(actualSampleRate / 1000)} {t("appSettings.sampleRateKHz")}</div>}
                                    </div>
                                </div>
                            </div>
                            <div className="mt-3">
                                <div className="font-normal text-base flex flex-col md:flex-row gap-3 md:items-center justify-between">
                                    <div className="md:w-3/6">
                                        <label htmlFor="bufferSizeSelect">{t("appSettings.bufferSize")}</label>
                                    </div>
                                    <div className="flex flex-row gap-x-2 items-center">
                                        <select className="select select-bordered flex-1" id="bufferSizeSelect" value={bufferSize} onChange={(e) => changeBufferSize(parseInt(e.target.value))}>
                                            {Constants.VALID_BUFFER_SIZE.map(size => <option value={size} key={size}>{size != 0 ? size : t("appSettings.defaultBufferSize")}</option>)}
                                        </select>
                                        <div className="tooltip tooltip-top tooltip-config-dialog-input md:tooltip-config-dialog-md" data-tip={t("appSettings.bufferSizeInfos")}>
                                            {InfoIcon}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-3">
                                <div className="font-normal text-base flex flex-col md:flex-row gap-3 md:items-center justify-between">
                                    <div className="md:w-3/6">
                                        <label htmlFor="sampleRateMP3Select">{t("appSettings.bitRateMP3")}</label>
                                    </div>
                                    <div className="flex flex-row gap-x-2 items-center">
                                        <select className="select select-bordered flex-1" id="sampleRateMP3Select" value={bitrateMP3} onChange={(e) => changeBitrateMP3(parseInt(e.target.value))}>
                                            {Constants.VALID_MP3_BITRATES.map(bitrate => <option value={bitrate} key={bitrate}>{bitrate} {t("appSettings.bitRateMP3Kbps")}</option>)}
                                        </select>
                                        <div className="tooltip tooltip-top tooltip-config-dialog-input md:tooltip-config-dialog-md" data-tip={t("appSettings.bitRateMP3Infos")}>
                                            {InfoIcon}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-3">
                                <div className="font-normal text-base flex flex-col md:flex-row gap-3 md:items-center justify-between">
                                    <div className="md:w-4/6">
                                        <label htmlFor="toggleAudioWorkletEnabled">{t("appSettings.audioWorkletEnable")}</label>
                                    </div>
                                    <div className="flex flex-row gap-x-2 justify-center md:justify-items-end">
                                        <input type="checkbox" className="toggle" id="toggleAudioWorkletEnabled" checked={isAudioWorkletEnabled} onChange={(e) => toggleAudioWorklet(e.target.checked)} />
                                        <div className="tooltip tooltip-top tooltip-config-dialog md:tooltip-config-dialog-md" data-tip={t("appSettings.audioWorkletEnableInfos")}>
                                            {InfoIcon}
                                        </div>
                                        {!audioWorkletAvailable && (
                                            <div className="tooltip tooltip-top tooltip-config-dialog md:tooltip-config-dialog-md text-error" data-tip={t("appSettings.audioWorkletNotAvailable")}>
                                                {ErrorIcon}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="mt-3">
                                <div className="font-normal text-base flex flex-col md:flex-row gap-3 md:items-center justify-between">
                                    <div className="md:w-4/6">
                                        <label htmlFor="toggleSoundtouchAudioWorkletEnabled">{t("appSettings.soundtouchAudioWorkletEnable")}</label>
                                    </div>
                                    <div className="flex flex-row gap-x-2 justify-center md:justify-items-end">
                                        <input type="checkbox" className="toggle" id="toggleSoundtouchAudioWorkletEnabled" checked={isSoundtouchAudioWorkletEnabled} onChange={(e) => toggleSoundtouchAudioWorklet(e.target.checked)} />
                                        <div className="tooltip tooltip-top tooltip-config-dialog md:tooltip-config-dialog-md" data-tip={t("appSettings.soundtouchAudioWorkletEnableInfos")}>
                                            {InfoIcon}
                                        </div>
                                        {!audioWorkletAvailable && (
                                            <div className="tooltip tooltip-top tooltip-config-dialog md:tooltip-config-dialog-md text-error" data-tip={t("appSettings.audioWorkletNotAvailable")}>
                                                {ErrorIcon}
                                            </div>
                                        )}
                                    </div>
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
        </dialog >
    );
};

export default AppConfigDialog;
