import Filter from "./filter";
import { SettingFormType } from "./settingFormType";

const filters: Filter[] = [
    {
        filterId: "bassboost",
        filterName: "Boost des basses",
        filterIcon: <svg xmlns="http://www.w3.org/2000/svg" height="1.75em" viewBox="0 0 24 24"><path d="M12,12A3,3 0 0,0 9,15A3,3 0 0,0 12,18A3,3 0 0,0 15,15A3,3 0 0,0 12,12M12,20A5,5 0 0,1 7,15A5,5 0 0,1 12,10A5,5 0 0,1 17,15A5,5 0 0,1 12,20M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8C10.89,8 10,7.1 10,6C10,4.89 10.89,4 12,4M17,2H7C5.89,2 5,2.89 5,4V20A2,2 0 0,0 7,22H17A2,2 0 0,0 19,20V4C19,2.89 18.1,2 17,2Z" /></svg>,
        hasSettings: true,
        info: "Ce filtre vous permet d'augmenter les basses de l'audio. Vous pouvez paramétrer la fréquence qui sera boostée ainsi que la puissance de boost (en dB). Il est conseillé d'utiliser cet outil conjointement avec le limiteur, pour éviter d'obtenir une saturation désagréable.",
        settingsModalTitle: "Paramètres du booster de basses",
        settingsForm: [
            {
                settingId: "labelInfo",
                settingTitle: "Vous pouvez régler ici les paramètres du booster des basses.",
                settingType: SettingFormType.SimpleLabel
            },
            {
                settingId: "frequencyBooster",
                settingTitle: "Fréquence de boost (booste les fréquences égales ou en dessous - en Hz) :",
                settingType: SettingFormType.NumberField
            },
            {
                settingId: "dbBooster",
                settingTitle: "Gain de boost (en dB) :",
                settingType: SettingFormType.NumberField
            },
            {
                settingId: "frequencyReduce",
                settingTitle: "Fréquence d'atténuation (atténue les fréquences au dessus - en Hz) :",
                settingType: SettingFormType.NumberField
            },
            {
                settingId: "dbReduce",
                settingTitle: "Gain d'atténuation (en dB) :",
                settingType: SettingFormType.NumberField
            }
        ]
    },
    {
        filterId: "bitcrusher",
        filterName: "Effet 8-bit",
        filterIcon: <svg xmlns="http://www.w3.org/2000/svg" height="1.5em" viewBox="0 0 640 512"><path d="M192 64C86 64 0 150 0 256S86 448 192 448H448c106 0 192-86 192-192s-86-192-192-192H192zM496 168a40 40 0 1 1 0 80 40 40 0 1 1 0-80zM392 304a40 40 0 1 1 80 0 40 40 0 1 1 -80 0zM168 200c0-13.3 10.7-24 24-24s24 10.7 24 24v32h32c13.3 0 24 10.7 24 24s-10.7 24-24 24H216v32c0 13.3-10.7 24-24 24s-24-10.7-24-24V280H136c-13.3 0-24-10.7-24-24s10.7-24 24-24h32V200z"/></svg>,
        hasSettings: true,
        info: "Ce filtre vous permet d'obtenir un effet similaire au son produit par les consoles de jeux vidéo rétro.",
        settingsModalTitle: "Paramètres du filtre d'effet 8-bits",
        settingsForm: [
            {
                settingId: "labelInfo",
                settingTitle: "Vous pouvez régler ici les paramètres du filtre d'effet 8-bits.",
                settingType: SettingFormType.SimpleLabel
            },
            {
                settingId: "bits",
                settingTitle: "Nombre de bits :",
                settingType: SettingFormType.NumberField
            },
            {
                settingId: "normFreq",
                settingTitle: "Fréquence de norme :",
                settingType: SettingFormType.NumberField
            }
        ]
    },
    {
        filterId: "echo",
        filterName: "Écho",
        filterIcon: <svg xmlns="http://www.w3.org/2000/svg" height="1.5em" viewBox="0 0 448 512"><path d="M319.4 372c48.5-31.3 80.6-85.9 80.6-148c0-97.2-78.8-176-176-176S48 126.8 48 224c0 62.1 32.1 116.6 80.6 148c1.2 17.3 4 38 7.2 57.1l.2 1C56 395.8 0 316.5 0 224C0 100.3 100.3 0 224 0S448 100.3 448 224c0 92.5-56 171.9-136 206.1l.2-1.1c3.1-19.2 6-39.8 7.2-57zm-2.3-38.1c-1.6-5.7-3.9-11.1-7-16.2c-5.8-9.7-13.5-17-21.9-22.4c19.5-17.6 31.8-43 31.8-71.3c0-53-43-96-96-96s-96 43-96 96c0 28.3 12.3 53.8 31.8 71.3c-8.4 5.4-16.1 12.7-21.9 22.4c-3.1 5.1-5.4 10.5-7 16.2C99.8 307.5 80 268 80 224c0-79.5 64.5-144 144-144s144 64.5 144 144c0 44-19.8 83.5-50.9 109.9zM224 312c32.9 0 64 8.6 64 43.8c0 33-12.9 104.1-20.6 132.9c-5.1 19-24.5 23.4-43.4 23.4s-38.2-4.4-43.4-23.4c-7.8-28.5-20.6-99.7-20.6-132.8c0-35.1 31.1-43.8 64-43.8zm0-144a56 56 0 1 1 0 112 56 56 0 1 1 0-112z"/></svg>,
        hasSettings: true,
        info: "Ce filtre vous permet d'obtenir un effet d'écho paramétrable.",
        settingsModalTitle: "Paramètres du filtre d'écho",
        settingsForm: [
            {
                settingId: "labelInfo",
                settingTitle: "Vous pouvez régler ici les paramètres du filtre d'écho.",
                settingType: SettingFormType.SimpleLabel
            },
            {
                settingId: "delay",
                settingTitle: "Délai (en secondes) :",
                settingType: SettingFormType.NumberField
            },
            {
                settingId: "gain",
                settingTitle: "Gain (en dB) :",
                settingType: SettingFormType.NumberField
            }
        ]
    },
    {
        filterId: "highpass",
        filterName: "Filtre passe-haut",
        filterIcon: <svg height="1.75em" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"><path d="m231.007 68.729c0-2.206-1.787-4.995-4.007-4.995h-85.499c-6.466 0-19.531 7.705-22.66 15.97l-55.92 85.647c-3.624 5.55-11.93 10.05-18.559 10.05h-16.195c-2.206 0-3.994 2.787-3.994 5.007v8.985a4.005 4.005 0 0 0 3.998 4.007h22.713c8.832 0 20.495-8.703 23.588-16.987l56.167-84.189c3.68-5.517 12.04-9.99 18.668-9.99h77.695c2.212 0 4.005-2.797 4.005-4.994v-8.51z" fill-rule="evenodd"/></svg>,
        hasSettings: true,
        info: "Ce filtre permet d'atténuer les fréquences audio se trouvant en dessous d'un seuil.",
        settingsModalTitle: "Paramètres du filtre passe-haut",
        settingsForm: [
            {
                settingId: "labelInfo",
                settingTitle: "Vous pouvez régler ici les paramètres du filtre passe-bas.",
                settingType: SettingFormType.SimpleLabel
            },
            {
                settingId: "highFrequency",
                settingTitle: "Fréquence de coupure (en Hz) :",
                settingType: SettingFormType.NumberField
            }
        ]
    },
    {
        filterId: "lowpass",
        filterName: "Filtre passe-bas",
        filterIcon: <svg height="1.75em" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"><path d="M24.22 67.796a3.995 3.995 0 0 1 4.008-3.991h85.498c8.834 0 19.732 6.112 24.345 13.657l53.76 87.936c3.46 5.66 11.628 10.247 18.256 10.247h16.718a3.996 3.996 0 0 1 3.994 4.007v8.985a4.007 4.007 0 0 1-4.007 4.008h-24.7c-8.835 0-19.709-6.13-24.283-13.683l-52.324-86.4c-3.43-5.665-11.577-10.257-18.202-10.257H28.214a3.995 3.995 0 0 1-3.993-3.992V67.796z" fill-rule="evenodd"/></svg>,
        hasSettings: true,
        info: "Ce filtre permet d'atténuer les fréquences audio se trouvant au dessus d'un seuil.",
        settingsModalTitle: "Paramètres du filtre passe-bas",
        settingsForm: [
            {
                settingId: "labelInfo",
                settingTitle: "Vous pouvez régler ici les paramètres du filtre passe-bas.",
                settingType: SettingFormType.SimpleLabel
            },
            {
                settingId: "lowFrequency",
                settingTitle: "Fréquence de coupure (en Hz) :",
                settingType: SettingFormType.NumberField
            }
        ]
    },
    {
        filterId: "reverb",
        filterName: "Réverbération",
        filterIcon: <svg xmlns="http://www.w3.org/2000/svg" height="1.5em" viewBox="0 0 640 512"><path d="M560 160A80 80 0 1 0 560 0a80 80 0 1 0 0 160zM55.9 512H381.1h75H578.9c33.8 0 61.1-27.4 61.1-61.1c0-11.2-3.1-22.2-8.9-31.8l-132-216.3C495 196.1 487.8 192 480 192s-15 4.1-19.1 10.7l-48.2 79L286.8 81c-6.6-10.6-18.3-17-30.8-17s-24.1 6.4-30.8 17L8.6 426.4C3 435.3 0 445.6 0 456.1C0 487 25 512 55.9 512z"/></svg>,
        hasSettings: true,
        info: "Ce filtre vous permet d'appliquer un effet de réverbération à votre audio. Plusieurs environnements virtuels sont proposés avec un effet de réverbération différent pour chacun de ces environnements.",
        settingsModalTitle: "Paramètres du filtre de réverbération",
        settingsForm: [
            {
                settingId: "labelInfo",
                settingTitle: "Vous pouvez régler ici les paramètres du filtre de réverbération (TODO).",
                settingType: SettingFormType.SimpleLabel
            }
        ]
    },
    {
        filterId: "vocoder",
        filterName: "Vocoder (voix robotique)",
        filterIcon: <svg xmlns="http://www.w3.org/2000/svg" height="1.5em" viewBox="0 0 640 512"><path d="M320 0c17.7 0 32 14.3 32 32V96H472c39.8 0 72 32.2 72 72V440c0 39.8-32.2 72-72 72H168c-39.8 0-72-32.2-72-72V168c0-39.8 32.2-72 72-72H288V32c0-17.7 14.3-32 32-32zM208 384c-8.8 0-16 7.2-16 16s7.2 16 16 16h32c8.8 0 16-7.2 16-16s-7.2-16-16-16H208zm96 0c-8.8 0-16 7.2-16 16s7.2 16 16 16h32c8.8 0 16-7.2 16-16s-7.2-16-16-16H304zm96 0c-8.8 0-16 7.2-16 16s7.2 16 16 16h32c8.8 0 16-7.2 16-16s-7.2-16-16-16H400zM264 256a40 40 0 1 0 -80 0 40 40 0 1 0 80 0zm152 40a40 40 0 1 0 0-80 40 40 0 1 0 0 80zM48 224H64V416H48c-26.5 0-48-21.5-48-48V272c0-26.5 21.5-48 48-48zm544 0c26.5 0 48 21.5 48 48v96c0 26.5-21.5 48-48 48H576V224h16z"/></svg>,
        hasSettings: false,
        info: "Ce filtre vous permet d'appliquer un effet de voix robotique à votre audio."
    },
    {
        filterId: "returnAudio",
        filterName: "Retourner l'audio",
        filterIcon: <svg xmlns="http://www.w3.org/2000/svg" height="1.5em" viewBox="0 0 512 512"><path d="M48.5 224H40c-13.3 0-24-10.7-24-24V72c0-9.7 5.8-18.5 14.8-22.2s19.3-1.7 26.2 5.2L98.6 96.6c87.6-86.5 228.7-86.2 315.8 1c87.5 87.5 87.5 229.3 0 316.8s-229.3 87.5-316.8 0c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0c62.5 62.5 163.8 62.5 226.3 0s62.5-163.8 0-226.3c-62.2-62.2-162.7-62.5-225.3-1L185 183c6.9 6.9 8.9 17.2 5.2 26.2s-12.5 14.8-22.2 14.8H48.5z"/></svg>,
        hasSettings: false,
        info: "Ce filtre vous permet de retourner l'audio."
    },
    {
        filterId: "telephonizer",
        filterName: "Appel téléphonique",
        filterIcon: <svg xmlns="http://www.w3.org/2000/svg" height="1.5em" viewBox="0 0 512 512"><path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z"/></svg>,
        hasSettings: false,
        info: "Ce filtre vous permet d'imiter le son produit par un téléphone qui diffuserait votre audio."
    },
    {
        filterId: "limiter",
        filterName: "Limiteur (recommandé)",
        filterIcon: <svg xmlns="http://www.w3.org/2000/svg" height="1.5em" viewBox="0 0 512 512"><path d="M0 416c0 17.7 14.3 32 32 32l54.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48L480 448c17.7 0 32-14.3 32-32s-14.3-32-32-32l-246.7 0c-12.3-28.3-40.5-48-73.3-48s-61 19.7-73.3 48L32 384c-17.7 0-32 14.3-32 32zm128 0a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zM320 256a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm32-80c-32.8 0-61 19.7-73.3 48L32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l246.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48l54.7 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-54.7 0c-12.3-28.3-40.5-48-73.3-48zM192 128a32 32 0 1 1 0-64 32 32 0 1 1 0 64zm73.3-64C253 35.7 224.8 16 192 16s-61 19.7-73.3 48L32 64C14.3 64 0 78.3 0 96s14.3 32 32 32l86.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48L480 128c17.7 0 32-14.3 32-32s-14.3-32-32-32L265.3 64z"/></svg>,
        hasSettings: true,
        info: "Ce filtre permet d'atténuer la saturation et la distorsion qui pourrait être produite selon les filtres que vous activez. Il est fortement conseillé de le laisser activer.",
        settingsModalTitle: "Paramètres du limiteur",
        settingsForm: [
            {
                settingId: "labelInfo",
                settingTitle: "Vous pouvez régler ici les paramètres du limiteur. Les paramètres par défaut ont été testés sur de nombreux fichiers audios et fonctionnent dans la plupart des cas.",
                settingType: SettingFormType.SimpleLabel
            },
            {
                settingId: "preGain",
                settingTitle: "Pré-gain (en dB) :",
                settingType: SettingFormType.NumberField
            },
            {
                settingId: "postGain",
                settingTitle: "Post-gain (en dB) :",
                settingType: SettingFormType.NumberField
            },
            {
                settingId: "attackTime",
                settingTitle: "Temps d'attaque (en secondes) :",
                settingType: SettingFormType.NumberField
            },
            {
                settingId: "releaseTime",
                settingTitle: "Temps de relâchement (en secondes) :",
                settingType: SettingFormType.NumberField
            },
            {
                settingId: "threshold",
                settingTitle: "Seuil (en dB) :",
                settingType: SettingFormType.NumberField
            },
            {
                settingId: "lookAheadTime",
                settingTitle: "Temps de look-ahead (en secondes) :",
                settingType: SettingFormType.NumberField
            }
        ]
    }
];

export default filters;