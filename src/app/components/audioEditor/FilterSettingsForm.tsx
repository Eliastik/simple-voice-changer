"use client";

import { useAudioEditor } from "@/app/context/AudioEditorContext";
import SettingForm from "@/app/utils/settingForm";
import { SettingFormType } from "@/app/utils/settingFormType";
import { useEffect, useState } from "react";

const FilterSettingsForm = ({
    filterId,
    settingsModalTitle,
    settingsForm
}: { filterId: string, settingsModalTitle?: string, settingsForm?: SettingForm[] }) => {
    const { filtersSettings, changeFilterSettings } = useAudioEditor();
    const [currentSettings, setCurrentSettings] = useState(null);

    useEffect(() => {
        setCurrentSettings(JSON.parse(JSON.stringify(filtersSettings.get(filterId))));
    }, [!currentSettings]);

    return (
        <>
            <div className="modal-box">
                <h3 className="font-bold text-lg">{settingsModalTitle}</h3>
                <form method="dialog">
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                </form>
                <div className="flex flex-col">
                    {settingsForm && settingsForm.map((setting => {
                        return (
                            <div className="mt-3" key={setting.settingId}>
                                {setting.settingType === SettingFormType.SimpleLabel && <p className="font-light text-base">{setting.settingTitle}</p>}
                                {setting.settingType === SettingFormType.NumberField && (
                                    <div className="font-normal text-base flex flex-col md:flex-row gap-3 md:items-center justify-between">
                                        <div className="md:w-3/6">
                                            <label htmlFor={`${filterId}_${setting.settingId}`}>{setting.settingTitle}</label>
                                        </div>
                                        <input type="number" className="input input-bordered md:w-3/6" id={`${filterId}_${setting.settingId}`}
                                            value={currentSettings ? currentSettings[setting.settingId] : ""}
                                            onChange={(e) => {
                                                const newSettings: any = JSON.parse(JSON.stringify(currentSettings));
                                                newSettings[setting.settingId] = parseInt(e.target.value);
                                                setCurrentSettings(newSettings);
                                            }}></input>
                                    </div>
                                )}
                            </div>
                        );
                    }))}
                </div>
                <div className="modal-action">
                    <form method="dialog">
                        <button className="btn btn-neutral mr-2" onClick={() => changeFilterSettings(filterId, currentSettings)}>Valider</button>
                        <button className="btn btn-error">Réinitialiser</button>
                    </form>
                </div>
            </div>
        </>
    )
};

export default FilterSettingsForm;