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
            homeMenu: {
                "selectAudioFile": "Select an audio file",
                "recMicrophone": "Record with the microphone"
            },
            audioEditorMain: {
                "validateSettings": "Validate settings"
            },
            audioPlayer: {
                "play": "Play",
                "pause": "Pause",
                "loop": "Loop playback",
                "save": "Save audio"
            },
            languages: {
                "fr": "Français",
                "en": "English"
            },
            dialogs: {
                "pleaseWait": "Please wait a few moments",
                bufferDownloading: {
                    "title": "Downloading data"
                },
                bufferDownloadingError: {
                    "title": "Error when downloading data",
                    "info": "Check your Internet connection, then try again."
                },
                fileOpenError: {
                    "title": "Error when opening file",
                    "info": "Make sure the file you've selected is a correct audio file, then try again."
                },
                filterInformations: {
                    "title": "Filter informations"
                },
                goToHome: {
                    "title": "Go back to homepage",
                    "info": "Are you sure that you want to exit and go back to the application homepage? You will lose all your unsaved changes."
                },
                loadingApp: {
                    "title": "Loading app"
                },
                loadingAudioFile: {
                    "title": "Loading audio file"
                },
                processing: {
                    "title": "Audio processing in progress"
                }
            },
            filters: {
                soundtouch: {
                    "name": "Change speed / frequency",
                    "info": "This filter lets you not only change the speed of the audio, but also its frequency. You can make the audio sound higher or lower.",
                    settings: {
                        "title": "Settings of the filter Change speed / frequency",
                        "label": "Here you can set audio speed and frequency (high/low).",
                        "speedAudio": "Audio speed:",
                        "audioFrequency": "Audio frequency:"
                    }
                }
            },
            close: "Close",
            ok: "OK",
            cancel: "Cancel",
            validate: "Validate",
            reset: "Reset"
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
            audioEditorMain: {
                "validateSettings": "Valider les paramètres"
            },
            audioPlayer: {
                "play": "Lire",
                "pause": "Pause",
                "loop": "Lire en boucle",
                "save": "Sauvegarder l'audio"
            },
            homeMenu: {
                "selectAudioFile": "Sélectionner un fichier audio",
                "recMicrophone": "Enregistrer via le micro"
            },
            dialogs: {
                "pleaseWait": "Merci de patienter quelques instants",
                bufferDownloading: {
                    "title": "Téléchargement des données"
                },
                bufferDownloadingError: {
                    "title": "Erreur lors du téléchargement des données",
                    "info": "Vérifiez votre connexion Internet, puis réessayez."
                },
                fileOpenError: {
                    "title": "Erreur lors de l'ouverture du fichier",
                    "info": "Assurez-vous que le fichier que vous avez sélectionné soit bien un fichier audio correct, puis réessayez."
                },
                filterInformations: {
                    "title": "Informations sur le filtre"
                },
                goToHome: {
                    "title": "Retourner à l'accueil",
                    "info": "Êtes-vous sûr de vouloir quitter et retourner à l'accueil de l'application ? Vous perdrez toutes vos modifications non enregistrées."
                },
                loadingApp: {
                    "title": "Chargement de l'application"
                },
                loadinAudioFile: {
                    "title": "Chargement du fichier audio"
                },
                processing: {
                    "title": "Traitement audio en cours"
                }
            },
            filters: {
                soundtouch: {
                    "name": "Modifier la vitesse / fréquence",
                    "info": "Ce filtre vous permet de modifier la vitesse de l'audio, mais également de modifier sa fréquence. Vous pouvez ainsi rendre l'audio plus aigu ou plus grave.",
                    settings: {
                        "title": "Paramètres du filtre Modifier la vitesse / fréquence",
                        "label": "Vous pouvez régler ici la vitesse de l'audio ainsi que sa fréquence (aigu/grave).",
                        "speedAudio": "Vitesse de l'audio :",
                        "audioFrequency": "Fréquence de l'audio :"
                    }
                }
            },
            close: "Fermer",
            ok: "OK",
            cancel: "Annuler",
            validate: "Valider",
            reset: "Réinitialiser"
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