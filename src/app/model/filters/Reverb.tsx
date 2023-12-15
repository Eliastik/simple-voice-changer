import Constants from "@/app/classes/model/Constants";
import Filter from "../Filter";
import { SettingFormTypeEnum } from "../settingForm/SettingFormTypeEnum";

export const Reverb: Filter = {
    filterId: Constants.FILTERS_NAMES.REVERB,
    filterName: "filters.reverb.name",
    filterIcon: <svg xmlns="http://www.w3.org/2000/svg" height="1.5em" viewBox="0 0 640 512" fill="currentColor"><path d="M560 160A80 80 0 1 0 560 0a80 80 0 1 0 0 160zM55.9 512H381.1h75H578.9c33.8 0 61.1-27.4 61.1-61.1c0-11.2-3.1-22.2-8.9-31.8l-132-216.3C495 196.1 487.8 192 480 192s-15 4.1-19.1 10.7l-48.2 79L286.8 81c-6.6-10.6-18.3-17-30.8-17s-24.1 6.4-30.8 17L8.6 426.4C3 435.3 0 445.6 0 456.1C0 487 25 512 55.9 512z" /></svg>,
    hasSettings: true,
    info: "filters.reverb.info",
    settingsModalTitle: "filters.reverb.settings.title",
    firstColumnStyle: "md:w-3/6",
    secondColumStyle: "md:w-5/6",
    disabledCondition: (filterSettings: any) => {
        if(filterSettings.downloadedBuffers
            && filterSettings.downloadedBuffers.filter((buffer: string) => buffer.startsWith("impulse_response")).length <= 0) {
            return "filters.reverb.disabled";
        }

        return null;
    },
    settingsForm: [
        {
            settingId: "labelInfo",
            settingTitle: "filters.reverb.settings.label",
            settingType: SettingFormTypeEnum.SimpleLabel
        },
        {
            settingId: "reverbEnvironment",
            settingTitle: "filters.reverb.settings.environment",
            settingType: SettingFormTypeEnum.SelectField,
            selectValues: [
                {
                    name: Constants.DEFAULT_REVERB_ENVIRONMENT.name,
                    value: Constants.DEFAULT_REVERB_ENVIRONMENT.url,
                    additionalData: {
                        size: Constants.DEFAULT_REVERB_ENVIRONMENT.size,
                        link: Constants.DEFAULT_REVERB_ENVIRONMENT.link,
                        addDuration: Constants.DEFAULT_REVERB_ENVIRONMENT.addDuration,
                    }
                },
                {
                    name: "The Dixon Studio Theatre – University of York",
                    value: "static/sounds/impulse_response_2.wav",
                    additionalData: {
                        size: 2304044,
                        link: "https://openairlib.net/?page_id=452",
                        addDuration: 3
                    }
                },
                {
                    name: "Creswell Crags",
                    value: "static/sounds/impulse_response_3.wav",
                    additionalData: {
                        size: 1048220,
                        link: "https://openairlib.net/?page_id=441",
                        addDuration: 1
                    }
                },
                {
                    name: "Jack Lyons Concert Hall – University of York",
                    value: "static/sounds/impulse_response_4.wav",
                    additionalData: {
                        size: 3072044,
                        link: "https://openairlib.net/?page_id=571",
                        addDuration: 4
                    }
                },
                {
                    name: "Stairway – University of York",
                    value: "static/sounds/impulse_response_5.wav",
                    additionalData: {
                        size: 1728198,
                        link: "https://openairlib.net/?page_id=678",
                        addDuration: 3
                    }
                },
                {
                    name: "1st Baptist Church Nashville",
                    value: "static/sounds/impulse_response_6.wav",
                    additionalData: {
                        size: 2050318,
                        link: "https://openairlib.net/?page_id=406",
                        addDuration: 4
                    }
                },
                {
                    name: "R1 Nuclear Reactor Hall",
                    value: "static/sounds/impulse_response_7.wav",
                    additionalData: {
                        size: 5840914,
                        link: "https://openairlib.net/?page_id=626",
                        addDuration: 20
                    }
                },
                {
                    name: "Maes Howe",
                    value: "static/sounds/impulse_response_8.wav",
                    additionalData: {
                        size: 288044,
                        link: "https://openairlib.net/?page_id=602",
                        addDuration: 1
                    }
                },
                {
                    name: "Tyndall Bruce Monument",
                    value: "static/sounds/impulse_response_9.wav",
                    additionalData: {
                        size: 1382674,
                        link: "https://openairlib.net/?page_id=764",
                        addDuration: 5
                    }
                },
                {
                    name: "Tvísöngur Sound Sculpture – Iceland",
                    value: "static/sounds/impulse_response_10.wav",
                    additionalData: {
                        size: 621026,
                        link: "https://openairlib.net/?page_id=752",
                        addDuration: 3
                    }
                },
                {
                    name: "Usina del Arte Symphony Hall",
                    value: "static/sounds/impulse_response_11.wav",
                    additionalData: {
                        size: 454714,
                        link: "https://openairlib.net/?page_id=770",
                        addDuration: 5
                    }
                },
                {
                    name: "Hoffmann Lime Kiln – Langcliffe, UK",
                    value: "static/sounds/impulse_response_12.wav",
                    additionalData: {
                        size: 1536044,
                        link: "https://openairlib.net/?page_id=518",
                        addDuration: 2
                    }
                },
                {
                    name: "Innocent Railway Tunnel (middle)",
                    value: "static/sounds/impulse_response_13.wav",
                    additionalData: {
                        size: 5760056,
                        link: "https://openairlib.net/?page_id=525",
                        addDuration: 5
                    }
                },
                {
                    name: "Hamilton Mausoleum",
                    value: "static/sounds/impulse_response_14.wav",
                    additionalData: {
                        size: 4320044,
                        link: "https://www.openair.hosted.york.ac.uk/?page_id=502",
                        addDuration: 15
                    }
                },
                {
                    name: "Lady Chapel – St Albans Cathedral",
                    value: "static/sounds/impulse_response_15.wav",
                    additionalData: {
                        size: 1587706,
                        link: "https://www.openair.hosted.york.ac.uk/?page_id=595",
                        addDuration: 6
                    }
                },
                {
                    name: "Sports Centre – University of York",
                    value: "static/sounds/impulse_response_16.wav",
                    additionalData: {
                        size: 5644996,
                        link: "https://www.openair.hosted.york.ac.uk/?page_id=665",
                        addDuration: 10
                    }
                },
                {
                    name: "Elveden Hall  – Suffolk England",
                    value: "static/sounds/impulse_response_17.wav",
                    additionalData: {
                        size: 1416536,
                        link: "https://www.openair.hosted.york.ac.uk/?page_id=459",
                        addDuration: 9
                    }
                },
                {
                    name: "York Guildhall Council Chamber",
                    value: "static/sounds/impulse_response_18.wav",
                    additionalData: {
                        size: 5760044,
                        link: "https://www.openair.hosted.york.ac.uk/?page_id=790",
                        addDuration: 5
                    }
                }
            ]
        },
        {
            settingId: "bufferSize",
            settingType: SettingFormTypeEnum.DynamicLabel,
            settingTitle: "",
            startIcon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
            </svg>,
            labelValue: "filters.reverb.settings.size",
        },
        {
            settingId: "reverbLinkSource",
            settingType: SettingFormTypeEnum.DynamicLink,
            settingTitle: "",
            labelValue: "filters.reverb.settings.source",
            linkValue: "${reverbEnvironment.additionalData.link}",
            startIcon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
            </svg>
        },
        {
            settingId: "isDownloadEnvironment",
            settingType: SettingFormTypeEnum.DynamicLabel,
            settingTitle: "",
            labelValue: "filters.reverb.settings.downloaded",
            cssClass: "text-green-400",
            startIcon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>,
            displayCondition: (filterSettings: any) => {
                const url = filterSettings.reverbEnvironment.value;

                if (url) {
                    return filterSettings.downloadedBuffers &&
                        filterSettings.downloadedBuffers.includes(url.substring(url.lastIndexOf("/") + 1));
                }
            }
        },
        {
            settingId: "isNotDownloadEnvironment",
            settingType: SettingFormTypeEnum.DynamicLabel,
            settingTitle: "",
            labelValue: "filters.reverb.settings.notDownloaded",
            cssClass: "text-red-400",
            startIcon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>,
            displayCondition: (filterSettings: any) => {
                const url = filterSettings.reverbEnvironment.value;

                if (url) {
                    return filterSettings.downloadedBuffers &&
                        !filterSettings.downloadedBuffers.includes(url.substring(url.lastIndexOf("/") + 1));
                }
            }
        }
    ]
};
