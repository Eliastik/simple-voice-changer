import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
    en: {
        translation: {
            appSettings: {
                "title": "App settings",
                "colorTheme": "Color theme:",
                "colorThemeAuto": "Device theme",
                "colorThemeLight": "Light theme",
                "colorThemeDark": "Dark theme",
                "language": "Language:"
            },
            languages: {
                "fr": "Français",
                "en": "English"
            },
            close: "Close"
        }
    },
    fr: {
        translation: {
            appSettings: {
                "title": "Paramètres de l'application",
                "colorTheme": "Thème de couleurs :",
                "colorThemeAuto": "Thème de l'appareil",
                "colorThemeLight": "Thème clair",
                "colorThemeDark": "Thème sombre",
                "language": "Langue :"
            },
            close: "Fermer"
        }
    }
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