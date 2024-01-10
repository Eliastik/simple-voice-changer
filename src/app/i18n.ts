import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import _ from "lodash";
import fr from "./locales/fr.json";
import en from "./locales/en.json";
import enLib from "@eliastik/simple-sound-studio-components/lib/locales/en.json";
import frLib from "@eliastik/simple-sound-studio-components/lib/locales/fr.json";

const resources = {
    en: _.merge(en, enLib),
    fr:  _.merge(fr, frLib)
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: ["en", "fr"],

        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
