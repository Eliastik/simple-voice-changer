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
                },
                bassboost: {
                    "name": "Bass booster",
                    "info": "This filter lets you boost the bass of your audio. You can set the frequency to be boosted and the boost power (in dB). It is advisable to use this tool in conjunction with the limiter, to avoid unpleasant saturation.",
                    settings: {
                        "title": "Bass booster settings",
                        "label": "Here you can set the bass booster parameters.",
                        "frequencyBoost": "Boost frequency (boosts frequencies equal to or below - in Hz):",
                        "gainBoost": "Boost gain (in dB):",
                        "attenuateFrequency": "Attenuation frequency (attenuates frequencies above - in Hz):",
                        "gainAttenuate": "Attenuation gain (in dB):"
                    }
                },
                bitcrusher: {
                    "name": "8-bit Effect",
                    "info": "This filter allows you to achieve an effect similar to the sound produced by retro video game consoles.",
                    "settings": {
                        "title": "8-bit effect settings",
                        "label": "Here you can edit the settings for the 8-bit effect.",
                        "resolution": "Resolution:",
                        "cutoffFrequency": "Cutoff frequency:"
                    }
                },
                echo: {
                    "name": "Echo",
                    "info": "This filter allows you to get a customizable echo effect.",
                    "settings": {
                        "title": "Echo effect settings",
                        "label": "Here you can edit the settings of the echo effect.",
                        "delay": "Delay (in seconds):",
                        "gain": "Gain (in dB):"
                    }
                },
                highpass: {
                    "name": "Highpass filter",
                    "info": "This filter allows you to attenuate audio frequencies below a threshold.",
                    "settings": {
                        "title": "Highpass filter settings",
                        "label": "Here you can edit the settings of the highpass filter.",
                        "highFrequency": "Cutoff frequency (in Hz):"
                    }
                },
                lowpass: {
                    "name": "Lowpass filter",
                    "info": "This filter allows you to attenuate audio frequencies above a threshold.",
                    "settings": {
                        "title": "Lowpass filter settings",
                        "label": "Here you can edit the settings of the lowpass filter.",
                        "lowFrequency": "Cutoff frequency (in Hz):"
                    }
                },
                returnAudio: {
                    "name": "Reverse audio",
                    "info": "This filter allows you to reverse the audio."
                },
                telephonizer: {
                    "name": "Telephone call effect",
                    "info": "This filter allows you to mimic the sound produced by a phone broadcasting your audio."
                },
                vocoder: {
                    "name": "Vocoder (robotic voice)",
                    "info": "This filter allows you to apply a robotic voice effect to your audio."
                },
                limiter: {
                    "name": "Limiter (recommended)",
                    "info": "This filter helps reduce saturation and distortion that may occur depending on the filters you activate. It is strongly recommended to keep it enabled.",
                    "settings": {
                        "title": "Limiter settings",
                        "label": "You can adjust the limiter's settings here. The default settings have been tested on many audio files and work in most cases.",
                        "preGain": "Pre-gain (in dB):",
                        "postGain": "Post-gain (in dB):",
                        "attackTime": "Attack time (in seconds):",
                        "releaseTime": "Release time (in seconds):",
                        "threshold": "Threshold (in dB):",
                        "lookAheadTime": "Look-ahead time (in seconds):"
                    }
                },
                reverb: {
                    "name": "Reverb",
                    "info": "This filter allows you to apply a reverb effect to your audio. Several virtual environments are offered, each with a different reverb effect for each of these environments.",
                    "settings": {
                        "title": "Reverb Filter Settings",
                        "label": "You can adjust the reverb filter settings here.",
                        "environment": "Environment:",
                        "size": "Size: ${(reverbEnvironment.additionalData.size / 1000000).toFixed(2)} MB",
                        "source": "Source",
                        "downloaded": "This environment has already been temporarily downloaded to your device",
                        "notDownloaded": "This environment has not been downloaded yet. By clicking Validate, the environment will be temporarily downloaded to your device."
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
                },
                bassboost: {
                    "name": "Boost des basses",
                    "info": "Ce filtre vous permet d'augmenter les basses de l'audio. Vous pouvez paramétrer la fréquence qui sera boostée ainsi que la puissance de boost (en dB). Il est conseillé d'utiliser cet outil conjointement avec le limiteur, pour éviter d'obtenir une saturation désagréable.",
                    settings: {
                        "title": "Paramètres du booster de basses",
                        "label": "Vous pouvez régler ici les paramètres du booster des basses.",
                        "frequencyBoost": "Fréquence de boost (booste les fréquences égales ou en dessous - en Hz) :",
                        "gainBoost": "Gain de boost (en dB) :",
                        "attenuateFrequency": "Fréquence d'atténuation (atténue les fréquences au dessus - en Hz) :",
                        "gainAttenuate": "Gain d'atténuation (en dB) :"
                    }
                },
                bitcrusher: {
                    "name": "Effet 8-bit",
                    "info": "Ce filtre vous permet d'obtenir un effet similaire au son produit par les consoles de jeux vidéo rétro.",
                    "settings": {
                        "title": "Paramètres du filtre d'effet 8-bits",
                        "label": "Vous pouvez régler ici les paramètres du filtre d'effet 8-bits.",
                        "resolution": "Résolution :",
                        "cutoffFrequency": "Fréquence d'écrêtage :"
                    }
                },
                echo: {
                    "name": "Écho",
                    "info": "Ce filtre vous permet d'obtenir un effet d'écho paramétrable.",
                    "settings": {
                        "title": "Paramètres du filtre d'écho",
                        "label": "Vous pouvez régler ici les paramètres du filtre d'écho.",
                        "delay": "Délai (en secondes) :",
                        "gain": "Gain (en dB) :"
                    }
                },
                highpass: {
                    "name": "Filtre passe-haut",
                    "info": "Ce filtre permet d'atténuer les fréquences audio se trouvant en dessous d'un seuil.",
                    "settings": {
                        "title": "Paramètres du filtre passe-haut",
                        "label": "Vous pouvez régler ici les paramètres du filtre passe-haut.",
                        "highFrequency": "Fréquence de coupure (en Hz) :"
                    }
                },
                lowpass: {
                    "name": "Filtre passe-bas",
                    "info": "Ce filtre permet d'atténuer les fréquences audio se trouvant au dessus d'un seuil.",
                    "settings": {
                        "title": "Paramètres du filtre passe-bas",
                        "label": "Vous pouvez régler ici les paramètres du filtre passe-bas.",
                        "lowFrequency": "Fréquence de coupure (en Hz) :"
                    }
                },
                returnAudio: {
                    "name": "Retourner l'audio",
                    "info": "Ce filtre vous permet de retourner l'audio."
                },
                telephonizer: {
                    "name": "Effet d'appel téléphonique",
                    "info": "Ce filtre vous permet d'imiter le son produit par un téléphone qui diffuserait votre audio."
                },
                vocoder: {
                    "name": "Vocoder (voix robotique)",
                    "info": "Ce filtre vous permet d'appliquer un effet de voix robotique à votre audio."
                },
                limiter: {
                    "name": "Limiteur (recommandé)",
                    "info": "Ce filtre permet d'atténuer la saturation et la distorsion qui pourrait être produite selon les filtres que vous activez. Il est fortement conseillé de le laisser activer.",
                    "settings": {
                        "title": "Paramètres du limiteur",
                        "label": "Vous pouvez régler ici les paramètres du limiteur. Les paramètres par défaut ont été testés sur de nombreux fichiers audios et fonctionnent dans la plupart des cas.",
                        "preGain": "Pré-gain (en dB) :",
                        "postGain": "Post-gain (en dB) :",
                        "attackTime": "Temps d'attaque (en secondes) :",
                        "releaseTime": "Temps de relâchement (en secondes) :",
                        "threshold": "Seuil (en dB) :",
                        "lookAheadTime": "Temps de look-ahead (en secondes) :"
                    }
                },
                reverb: {
                    "name": "Réverbération",
                    "info": "Ce filtre vous permet d'appliquer un effet de réverbération à votre audio. Plusieurs environnements virtuels sont proposés avec un effet de réverbération différent pour chacun de ces environnements.",
                    "settings": {
                        "title": "Paramètres du filtre de réverbération",
                        "label": "Vous pouvez régler ici les paramètres du filtre de réverbération.",
                        "environment": "Environnement :",
                        "size": "Taille : ${(reverbEnvironment.additionalData.size / 1000000).toFixed(2).replace('.', ',')} Mo",
                        "source": "Source",
                        "downloaded": "Cet environnement a déjà été téléchargé temporairement sur votre appareil",
                        "notDownloaded": "Cet environnement n'a pas encore été téléchargé. En cliquant sur Valider, l'environnement sera téléchargé temporairement sur votre appareil"
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