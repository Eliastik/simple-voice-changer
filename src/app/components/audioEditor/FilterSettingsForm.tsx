"use client";

import { useAudioEditor } from "@/app/context/AudioEditorContext";
import { useEffect, useState } from "react";
import _ from "lodash";
import { useTranslation } from "react-i18next";
import { SettingFormType } from "@/app/model/settingForm/SettingFormType";
import { SettingFormTypeEnum } from "@/app/model/settingForm/SettingFormTypeEnum";
import { FilterSettings } from "@eliastik/simple-sound-studio-lib";
import SelectFormValue from "@/app/model/settingForm/SelectFormValue";

const getStringFromTemplate = (data: FilterSettings | null | undefined, str?: string) =>{
    if(str) {
        const template = _.template(str);

        try {
            if(data) {
                return template(data);
            }
        } catch(e) {
            return "";
        }
    }
    
    return "";
};

const FilterSettingsForm = ({
    filterId,
    settingsModalTitle,
    settingsForm,
    firstColumnStyle,
    secondColumnStyle
}: { filterId: string, settingsModalTitle?: string, settingsForm?: SettingFormType[], firstColumnStyle?: string, secondColumnStyle?: string }) => {
    const { filtersSettings, changeFilterSettings, resetFilterSettings } = useAudioEditor();
    const [currentSettings, setCurrentSettings] = useState<FilterSettings | null | undefined>(null);
    const { t } = useTranslation();

    const filterSettings = filtersSettings && filtersSettings.get(filterId);

    useEffect(() => {
        setCurrentSettings(_.cloneDeep(filterSettings));
    }, [filterId, filterSettings]);

    return (
        <>
            <div className="modal-box">
                {settingsModalTitle && <h3 className="font-bold text-lg">{t(settingsModalTitle)}</h3>}
                <form method="dialog">
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                </form>
                <div className="flex flex-col">
                    {settingsForm && settingsForm.map((setting => {
                        if(setting.displayCondition && currentSettings && !setting.displayCondition(currentSettings)) {
                            return;
                        }

                        return (
                            <div className={`mt-3 ${setting.cssClass || ""}`} key={setting.settingId}>
                                <div className="font-normal text-base flex flex-col md:flex-row gap-3 md:items-center justify-between">
                                    {setting.settingType && setting.settingType !== SettingFormTypeEnum.SimpleLabel && <div className={firstColumnStyle ? firstColumnStyle : "md:w-3/6"}>
                                        <label htmlFor={`${filterId}_${setting.settingId}`}>{t(setting.settingTitle)}</label>
                                    </div>}
                                    {setting.settingType === SettingFormTypeEnum.SimpleLabel &&
                                        <p className="font-light text-base flex flex-row gap-x-3 items-center">
                                            {setting.startIcon && <span>{setting.startIcon}</span>}
                                            <span>{t(setting.settingTitle ? setting.settingTitle : setting.labelValue!)}</span>
                                        </p>
                                    }
                                    {setting.settingType === SettingFormTypeEnum.DynamicLabel &&
                                        <p className={`font-light text-md flex flex-row gap-x-3 items-center ${secondColumnStyle ? secondColumnStyle : "md:w-3/6"}`}>
                                            {setting.startIcon && <span>{setting.startIcon}</span>}
                                            <span>{getStringFromTemplate(currentSettings, t(setting.labelValue!))}</span>
                                        </p>
                                    }
                                    {setting.settingType === SettingFormTypeEnum.SimpleLink &&
                                        <p className={`font-light text-md flex flex-row gap-x-3 items-center ${secondColumnStyle ? secondColumnStyle : "md:w-3/6"}`}>
                                            {setting.startIcon && <span>{setting.startIcon}</span>}
                                            <span>
                                                <a href={setting.linkValue}
                                                    target="_blank"
                                                    className="link link-info link-hover">
                                                    {t(setting.labelValue!)}
                                                </a>
                                            </span>
                                        </p>
                                    }
                                    {setting.settingType === SettingFormTypeEnum.DynamicLink &&
                                        <p className={`font-light text-md flex flex-row gap-x-3 items-center ${secondColumnStyle ? secondColumnStyle : "md:w-3/6"}`}>
                                            {setting.startIcon && <span>{setting.startIcon}</span>}
                                            <span>
                                                <a href={getStringFromTemplate(currentSettings, setting.linkValue)}
                                                    target="_blank"
                                                    className="link link-info link-hover">
                                                    {getStringFromTemplate(currentSettings, t(setting.labelValue!))}
                                                </a>
                                            </span>
                                        </p>
                                    }
                                    {setting.settingType === SettingFormTypeEnum.NumberField && (
                                        <input type="number" className={`input input-bordered ${secondColumnStyle ? secondColumnStyle : "md:w-3/6"}`} id={`${filterId}_${setting.settingId}`}
                                            value={currentSettings ? currentSettings[setting.settingId] as string : ""}
                                            step={setting.step ? 0.1 : setting.step}
                                            min={setting.minValue}
                                            max={setting.maxValue}
                                            onChange={(e) => {
                                                const newSettings: FilterSettings | null | undefined = _.cloneDeep(currentSettings);

                                                if(newSettings) {
                                                    newSettings[setting.settingId] = e.target.value;
                                                    setCurrentSettings(newSettings);
                                                }
                                            }}></input>
                                    )}
                                    {setting.settingType === SettingFormTypeEnum.Range && (
                                        <div className={`flex flex-col ${secondColumnStyle ? secondColumnStyle : "md:w-3/6"}`}>
                                            <input type="range" className="range range-accent" id={`${filterId}_${setting.settingId}`}
                                                value={currentSettings ? currentSettings[setting.settingId] as string : ""}
                                                step={setting.step ? 0.1 : setting.step}
                                                min={setting.minValue}
                                                max={setting.maxValue}
                                                onChange={(e) => {
                                                    const newSettings: FilterSettings | null | undefined = _.cloneDeep(currentSettings);

                                                    if(newSettings) {
                                                        newSettings[setting.settingId] = e.target.value;
                                                        setCurrentSettings(newSettings);
                                                    }
                                                }}></input>
                                            <div className="flex justify-between items-center flex-wrap font-light mt-3 mb-3">
                                                <span>{setting.minValueLabel && t(setting.minValueLabel)}</span>
                                                <span className="text-center">{setting.displayCurrentValue && currentSettings ? "×" + currentSettings[setting.settingId] : ""}</span>
                                                <span>{setting.maxValueLabel && t(setting.maxValueLabel)}</span>
                                            </div>
                                        </div>
                                    )}
                                    {setting.settingType === SettingFormTypeEnum.SelectField && (
                                        <select className={`select select-bordered ${secondColumnStyle ? secondColumnStyle : "md:w-3/6"}`} id={`${filterId}_${setting.settingId}`}
                                            value={currentSettings ? currentSettings[setting.settingId] && (currentSettings[setting.settingId] as SelectFormValue).value : ""}
                                            onChange={(e) => {
                                                const newSettings: FilterSettings | null | undefined = _.cloneDeep(currentSettings);
                                                
                                                let additionalData = undefined;
                                                let settingName = "";

                                                if(setting.selectValues) {
                                                    const currentSettingValue = setting.selectValues.find(val => val.value === e.target.value);
    
                                                    if(currentSettingValue) {
                                                        additionalData = currentSettingValue.additionalData;
                                                        settingName = currentSettingValue.name;
                                                    }
                                                }

                                                if(newSettings) {
                                                    newSettings[setting.settingId] = {
                                                        name: settingName,
                                                        value: e.target.value,
                                                        additionalData
                                                    };
                                                }

                                                setCurrentSettings(newSettings);
                                            }}>
                                            {
                                                setting.selectValues && setting.selectValues.map((option => {
                                                    return (
                                                        <option value={option.value} key={option.name}>
                                                            {t(option.name)}
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
                            if(currentSettings) {
                                changeFilterSettings(filterId, currentSettings);
                            }
                        }}>{t("validate")}</button>
                        <button className="btn btn-error" onClick={(e) => {
                            resetFilterSettings(filterId);
                            e.preventDefault();
                        }}>{t("reset")}</button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default FilterSettingsForm;
