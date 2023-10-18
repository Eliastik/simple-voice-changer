"use client";

import { useAudioEditor } from "@/app/context/AudioEditorContext";
import SettingForm from "@/app/utils/settingForm";
import { SettingFormType } from "@/app/utils/settingFormType";
import { useEffect, useState } from "react";
import _ from "lodash";

const getStringFromTemplate = (data: any, str?: string) =>{
    if(str) {
        const template = _.template(str);
        console.log(JSON.parse(JSON.stringify(data)));

        try {
            return template(data);
        } catch(e) {
            return "";
        }
    }
    
    return "";
}

const FilterSettingsForm = ({
    filterId,
    settingsModalTitle,
    settingsForm,
    firstColumnStyle,
    secondColumnStyle
}: { filterId: string, settingsModalTitle?: string, settingsForm?: SettingForm[], firstColumnStyle?: string, secondColumnStyle?: string }) => {
    const { filtersSettings, changeFilterSettings } = useAudioEditor();
    const [currentSettings, setCurrentSettings] = useState(null);
    const [initialSettings, setInitialSettings] = useState(null);

    useEffect(() => {
        setCurrentSettings(JSON.parse(JSON.stringify(filtersSettings.get(filterId))));
        setInitialSettings(currentSettings);

        console.log(currentSettings);
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
                                <div className="font-normal text-base flex flex-col md:flex-row gap-3 md:items-center justify-between">
                                    {setting.settingType && setting.settingType !== SettingFormType.SimpleLabel && <div className={firstColumnStyle ? firstColumnStyle : "md:w-3/6"}>
                                        <label htmlFor={`${filterId}_${setting.settingId}`}>{setting.settingTitle}</label>
                                    </div>}
                                    {setting.settingType === SettingFormType.SimpleLabel && <p className="font-light text-base">{setting.settingTitle ? setting.settingTitle : setting.labelValue}</p>}
                                    {setting.settingType === SettingFormType.DynamicLabel && <p className={`font-light text-md ${secondColumnStyle ? secondColumnStyle : "md:w-3/6"}`}>{getStringFromTemplate(currentSettings, setting.labelValue)}</p>}
                                    {setting.settingType === SettingFormType.SimpleLink && <p className={`font-light text-md ${secondColumnStyle ? secondColumnStyle : "md:w-3/6"}`}><a href={setting.linkValue} target="_blank" className="link link-info link-hover">{setting.labelValue}</a></p>}
                                    {setting.settingType === SettingFormType.DynamicLink && <p className={`font-light text-md ${secondColumnStyle ? secondColumnStyle : "md:w-3/6"}`}><a href={getStringFromTemplate(currentSettings, setting.linkValue)} target="_blank" className="link link-info link-hover">{getStringFromTemplate(currentSettings, setting.labelValue)}</a></p>}
                                    {setting.settingType === SettingFormType.NumberField && (
                                        <input type="number" className={`input input-bordered ${secondColumnStyle ? secondColumnStyle : "md:w-3/6"}`} id={`${filterId}_${setting.settingId}`}
                                            value={currentSettings ? currentSettings[setting.settingId] : ""}
                                            step="0.1"
                                            onChange={(e) => {
                                                const newSettings: any = JSON.parse(JSON.stringify(currentSettings));
                                                newSettings[setting.settingId] = e.target.value;
                                                setCurrentSettings(newSettings);
                                            }}></input>
                                    )}
                                    {setting.settingType === SettingFormType.SelectField && (
                                        <select className={`select select-bordered ${secondColumnStyle ? secondColumnStyle : "md:w-3/6"}`} id={`${filterId}_${setting.settingId}`}
                                            value={currentSettings ? currentSettings[setting.settingId] && (currentSettings[setting.settingId] as any).value : ""}
                                            onChange={(e) => {
                                                const newSettings: any = JSON.parse(JSON.stringify(currentSettings));
                                                let additionalData = null;

                                                if(setting.selectValues) {
                                                    const currentSettingValue = setting.selectValues.find(val => val.value === e.target.value);
    
                                                    if(currentSettingValue) {
                                                        additionalData = currentSettingValue.additionalData
                                                    }
                                                }

                                                newSettings[setting.settingId] = {
                                                    value: e.target.value,
                                                    additionalData
                                                };

                                                setCurrentSettings(newSettings);
                                            }}>
                                                {
                                                    setting.selectValues && setting.selectValues.map((option => {
                                                        return (
                                                            <option value={option.value} key={option.name}>
                                                                {option.name}
                                                            </option>
                                                        );
                                                    }))
                                                }
                                            </select>
                                    )}
                                </div>
                            </div>
                        );
                    }))}
                </div>
                <div className="modal-action">
                    <form method="dialog">
                        <button className="btn btn-neutral mr-2" onClick={() => {
                            changeFilterSettings(filterId, currentSettings);
                            setCurrentSettings(null);
                            setInitialSettings(null);
                        }}>Valider</button>
                        <button className="btn btn-error" onClick={(e) => {
                            setCurrentSettings(initialSettings);
                            e.preventDefault();
                        }}>Réinitialiser</button>
                    </form>
                </div>
            </div>
        </>
    )
};

export default FilterSettingsForm;