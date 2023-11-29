import { useTranslation } from "react-i18next";
import { useAudioRecorder } from "@/app/context/AudioRecorderContext";

const RecorderConfigDialog = () => {
    const { recorderSettings, changeInput, toggleAudioFeedback, toggleEchoCancellation, toggleNoiseReduction, toggleAutoGainControl } = useAudioRecorder();
    const { t } = useTranslation();

    return (
        <dialog id="recorderSettingsModal" className="modal">
            <div className="modal-box">
                <h3 className="font-bold text-lg">{t("recorderSettings.title")}</h3>
                <form method="dialog">
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                </form>
                <div className="flex flex-col">
                    <div className="mt-3">
                        <div className="font-normal text-base flex flex-col md:flex-row gap-3 md:items-center justify-between">
                            <div className="md:w-3/6">
                                <label htmlFor="recorderDevice">{t("recorderSettings.device")}</label>
                            </div>
                            <select
                                className="select select-bordered md:w-4/6"
                                id="recorderDevice"
                                value={recorderSettings.constraints.deviceId}
                                onChange={event => changeInput(event.target.value, event.target.options[event.target.selectedIndex].dataset.groupid)}>
                                {recorderSettings.deviceList.map(device => <option value={device.deviceId} key={device.deviceId + "-" + device.groupId} data-groupid={device.groupId}>{device.label}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="mt-3">
                        <div className="font-normal text-base flex flex-col md:flex-row gap-3 md:items-center justify-between">
                            <div className="md:w-3/6">
                                <label htmlFor="recorderAudioFeedback">{t("recorderSettings.audioFeedback")}</label>
                            </div>
                            <div className="flex flex-row gap-x-2">
                                <input type="checkbox" className="toggle" id="recorderAudioFeedback" checked={recorderSettings.audioFeedback} onChange={event => toggleAudioFeedback(event.target.checked)} />
                            </div>
                        </div>
                    </div>
                    <div className="mt-3">
                        <div className="font-normal text-base flex flex-col md:flex-row gap-3 md:items-center justify-between">
                            <div className="md:w-3/6">
                                <label htmlFor="recorderEchoCancellation">{t("recorderSettings.echoCancellation")}</label>
                            </div>
                            <div className="flex flex-row gap-x-2">
                                <input type="checkbox" className="toggle" id="recorderEchoCancellation" checked={recorderSettings.constraints.echoCancellation} onChange={event => toggleEchoCancellation(event.target.checked)} />
                            </div>
                        </div>
                    </div>
                    <div className="mt-3">
                        <div className="font-normal text-base flex flex-col md:flex-row gap-3 md:items-center justify-between">
                            <div className="md:w-3/6">
                                <label htmlFor="recorderNoiseSuppression">{t("recorderSettings.noiseSuppression")}</label>
                            </div>
                            <div className="flex flex-row gap-x-2">
                                <input type="checkbox" className="toggle" id="recorderNoiseSuppression" checked={recorderSettings.constraints.noiseSuppression} onChange={event => toggleNoiseReduction(event.target.checked)} />
                            </div>
                        </div>
                    </div>
                    <div className="mt-3">
                        <div className="font-normal text-base flex flex-col md:flex-row gap-3 md:items-center justify-between">
                            <div className="md:w-3/6">
                                <label htmlFor="recorderAutoGainControl">{t("recorderSettings.autoGainControl")}</label>
                            </div>
                            <div className="flex flex-row gap-x-2">
                                <input type="checkbox" className="toggle" id="recorderAutoGainControl" checked={recorderSettings.constraints.autoGainControl} onChange={event => toggleAutoGainControl(event.target.checked)} />
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

export default RecorderConfigDialog;