/*
 * Copyright (C) 2019 Eliastik (eliastiksofts.com)
 *
 * This file is part of "Simple Voice Changer".
 *
 * "Simple Voice Changer" is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * "Simple Voice Changer" is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with "Simple Voice Changer".  If not, see <http://www.gnu.org/licenses/>.
 */
import i18next from "i18next";

 // French
 i18next.addResourceBundle("fr", "translation", {
   "lang": {
     "fr": "Français",
     "en": "English"
   },
   "language": "Langue :",
   "or": "ou",
   "orMaj": "Ou",
   "close": "Fermer",
   "reset": "Réinitialiser",
   "update": {
     "updateAvailable": "Une mise à jour de l'application est disponible",
     "version": "Version",
     "of": "du",
     "current": "Vous disposez actuellement de la version",
     "versionDate": "{{date, DD/MM/YYYY}}",
     "download": "Télécharger la mise à jour",
     "getURL": "Obtenir l'adresse URL du téléchargement",
     "getChanges": "Obtenir la liste des changements",
     "URLToDownload": "Adresse URL menant au téléchargement :",
     "noChanges": "Aucun changement renseigné.",
     "changes": "Changements de la nouvelle version :"
   },
   "heading": {
     "connectionError": "Une erreur de connexion est survenue lors du chargement de certaines données. Vérifiez votre connexion Internet puis",
     "connectionErrorRetry": "cliquez ici pour tenter de recharger les données",
     "connectionErrorReload": "rechargez la page",
     "connectionErrorInfo": "Si vous utilisez cette application en local et à cause de limitations techniques, le chargement des données est bloqué, ce qui empêchera à certaines fonctionnalités de fonctionner (Vocoder, Réverbération). Dans ce cas,",
     "connectionErrorOnline": "utilisez la version en ligne",
     "description": "Simple Voice Changer vous permet de modifier la voix d'un fichier audio ou d'un enregistrement rapidement et simplement : choisissez un fichier audio, ou enregistrez-vous, et vous pouvez modifier et enregistrer ! Tout le traitement audio se fait sur votre appareil et aucune donnée n'est envoyée sur Internet."
   },
   "loading": {
     "loading": "Chargement…",
     "audioLoading": "Chargement des données audio :",
     "errorLoadingTooltip": "Une erreur est survenue lors du chargement de certaines données. Cette fonctionnalité est donc indisponible. Essayez de recharger la page (F5).",
   },
   "firstStep": {
     "first": "ère",
     "title": "étape : sélectionnez un fichier audio, ou enregistrez votre voix",
     "errorLoadingFile": "Une erreur est survenue lors du chargement du fichier sélectionné.",
     "selectFile": "Sélectionner un fichier audio",
     "record": "Enregistrer via le micro"
   },
   "firstStepBis": {
     "title": "étape bis : enregistrez votre voix",
     "error": "Une erreur est survenue lors de la connexion au périphérique d'entrée. Assurez-vous d'avoir autorisé l'accès et d'avoir un périphérique d'entrée correctement connecté, puis réessayez.",
     "info": "Autorisez l'accès au microphone sur la notification qui est apparue sur votre navigateur web.",
     "description": "Vous pouvez maintenant vous enregistrer à l'aide de votre micro. Appuyez sur Démarrer pour commencer, et appuyez sur Stop dès que vous avez terminé pour commencer à modifier votre voix. Vous pouvez aussi mettre en pause l'enregistrement quand vous le voulez.",
     "audioFeedback": "Retour audio",
     "autoGain": "Gain automatique",
     "echoCancellation": "Annulation d'écho",
     "noiseSuppression": "Réduction de bruit",
     "audioInput": "Périphérique d'entrée :",
     "start": "Démarrer",
     "pause": "Pause",
     "stop": "Stop",
     "duration": "Durée de l'enregistrement :",
     "cancel": "Annuler"
   },
   "secondStep":  {
     "loadingFile": "Chargement en cours… Veuillez patienter."
   },
   "thirdStep": {
     "otherFile": "Choisir un autre fichier ou enregistrement",
     "nb": "ème",
     "title": "étape : modifiez et testez",
     "play": "Lire",
     "pause": "Pause",
     "stop": "Stop",
     "loopPlay": "Lire en boucle",
     "processing": "Traitement en cours… Veuillez patienter.",
     "pitch": "Pitch (hauteur de la voix) :",
     "lowPitch": "Grave",
     "highPitch": "Aigu",
     "speed": "Vitesse :",
     "slow": "Lent",
     "fast": "Rapide",
     "reverb": "Réverbération",
     "echo": "Écho",
     "vocoder": "Vocoder (voix robotique)",
     "returnAudio": "Retourner l'audio",
     "bitCrusher": "Effet 8 bits",
     "lowpass": "Filtre passe-bas",
     "highpass": "Filtre passe-haut",
     "bassboost": "Boost des basses",
     "phone": "Appel téléphonique",
     "limiter": "Limiteur (réduit la distorsion/saturation, recommandé)",
     "compatibilityMode": "Mode de compatibilité (cocher si aucun son n'est diffusé)",
     "compatibilityModeAuto": "Détecté et activé automatiquement",
     "infosCompatibilityMode": "Ce mode vous permet également de modifier le son en temps réel",
     "validate": "Valider",
     "random": "Réglages au hasard",
     "reset": "Réinitialiser"
   },
   "lastStep": {
     "rd": "ème",
     "title": "étape : enregistrez vos modifications",
     "description": "N'oubliez pas de cliquer sur Valider afin de valider vos modifications avant d'enregistrer. L'enregistrement se fera sous le format WAV (non compressé).",
     "saving": "Enregistrement en cours… Veuillez patienter. Votre modification sera téléchargée sous peu.",
     "delay": "L'enregistrement se terminera dans environ",
     "delayInfo": "Il y a un délai car le mode de compatibilité est activé.",
     "infosCompatibilityMode": "Vous pouvez également modifier le son enregistré en temps réel.",
     "save": "Enregistrer",
     "cancel": "Annuler"
   },
   "footer": {
     "by": "Par",
     "download": "Télécharger le projet",
     "readme": "Fichier Lisez-moi",
     "github": "Dépôt Github",
     "browserCompatibility": "Voir les navigateurs compatibles",
     "version": "Version"
   },
   "compatibility": {
     "title": "Navigateurs compatibles",
     "lead": "Simple Voice Changer est compatible avec les navigateurs suivants (versions mobiles comprises) :",
     "chrome": "Chrome, Chromium et autres navigateurs basés sur Chromium (Opera, Vivaldi, etc.)",
     "issuesTitle": "Problèmes connus :",
     "issue1": "La sauvegarde de la modification échoue sur Firefox et Microsoft Edge à cause d'un bug de ces navigateurs (par exemple",
     "issue1Link": "sur Firefox",
     "issue1Last": "L'application utilise un mode de compatibilité pour tenter de passer outre ce bug, la sauvegarde peut ainsi prendre plus de temps. Ce problème ne touche pas Chrome, Chromium ainsi que les autres navigateurs basés sur Chromium.",
     "issue2": "Si la carte son de votre appareil est configurée en 192 KHz ou plus (taux d'échantillonnage), le Vocoder fonctionnera mal. Configurez-là en 92 KHz ou moins dans ce cas. Dans la plupart des cas, vous ne devriez pas vous soucier de cela car la plupart des appareils sont configurés par défaut en 44 KHz ou 48 KHz."
   },
   "limiterSettings": {
      "title": "Paramètres du limiteur",
      "lead": "Vous pouvez régler ici les paramètres du limiteur. Les paramètres par défaut ont été testés sur de nombreux fichiers audios et fonctionnent dans la plupart des cas.",
      "preGain": "Pré-gain (en dB) :",
      "postGain": "Post-gain (en dB) :",
      "attackTime": "Temps d'attaque (en secondes) :",
      "releaseTime": "Temps de release (en secondes) :",
      "threshold": "Seuil (en dB) :",
      "lookAheadTime": "Temps de look-ahead (en secondes) :"
   },
   "bassBoostSettings": {
      "title": "Paramètres du booster des basses",
      "lead": "Vous pouvez régler ici les paramètres du booster des basses.",
      "frequencyBooster": "Fréquence de boost (booste les fréquences égales ou en dessous - en Hz) :",
      "dbBooster": "Gain de boost (en dB) :",
      "frequencyReduce": "Fréquence d'atténuation (atténue les fréquences au dessus - en Hz) :",
      "dbReduce": "Gain d'atténuation (en dB) :"
   },
   "highPassSettings": {
      "title": "Paramètres du filtre passe-haut",
      "lead": "Vous pouvez régler ici les paramètres du filtre passe-haut.",
      "frequencyHighPass": "Fréquence de coupure (en Hz) :"
   },
   "lowPassSettings": {
      "title": "Paramètres du filtre passe-bas",
      "lead": "Vous pouvez régler ici les paramètres du filtre passe-bas.",
      "frequencyLowPass": "Fréquence de coupure (en Hz) :"
   },
   "delaySettings": {
      "title": "Paramètres du filtre d'écho",
      "lead": "Vous pouvez régler ici les paramètres du filtre d'écho.",
      "delaySeconds": "Délai (en secondes) :",
      "delayGain": "Gain (en dB) :"
   },
   "reverbSettings": {
      "title": "Paramètres du filtre réverbération",
      "lead": "Vous pouvez régler ici les paramètres du filtre réverbération.",
      "environmentReverb": "Environnement :",
      "environmentSize": "Taille de l'environnement :",
      "unit": {
          "byte": "o",
          "kilobyte": "Ko",
          "megabyte": "Mo",
          "gigabyte": "Go"
      },
      "source": "Source",
      "environmentSettingsInfos": "En cliquant sur Valider, l'environnement sera téléchargé temporairement sur votre appareil. Cela peut engendrer des frais.",
      "environmentAlreadyDownloaded": "Cet environnement a déjà été téléchargé.",
      "environmentAlreadyDownloadedLowQuality": "Cet environnement a été téléchargé en une version basse qualité pour des raisons de performance. Cliquez sur Valider pour télécharger la version en meilleure qualité.",
      "loading": "Chargement de l'environnement en cours… Veuillez patienter.",
      "error": "Une erreur est survenue lors du chargement de l'environnement. Veuillez réessayer."
   },
   "script": {
     "errorAudioContext": "Une erreur est survenue lors de la création d'un contexte audio (l'API Web Audio semble ne pas être supportée) :",
     "webAudioNotSupported": "API Web Audio non supportée par ce navigateur.",
     "workersNotSupported": "Les Workers ne sont pas supportés par ce navigateur.",
     "notAvailableCompatibilityMode": "Non disponible en mode de compatibilité.",
     "notCompatible": "Désolé, cette fonction est incompatible avec votre navigateur.",
     "notAvailable": "Désolé, cette fonction est actuellement indisponible.",
     "errorOccured": "Une erreur est survenue.",
     "invalidPitch": "Valeur du pitch invalide !",
     "invalidSpeed": "Valeur de la vitesse invalide !",
     "launchReset": "Vos modifications non enregistrées seront perdues. Êtes-vous sûr de vouloir choisir un autre fichier ou enregistrement ?",
     "browserNotCompatible": "Désolé, votre navigateur n'est pas compatible avec cette application. Mettez-le à jour, puis réessayez.",
     "appClosing": "Si vous fermez cette page, vous perdrez définitivement toutes vos modifications. Êtes-vous sûr de vouloir quitter cette page ?",
     "workersErrorLoading": "Une erreur est survenue lors du lancement de l'enregistrement. L'enregistrement en désactivant le mode de compatibilité ne fonctionne pas en local. Essayez d'utiliser l'application en ligne."
   }
}, true, false);

// English
i18next.addResourceBundle("en", "translation", {
  "lang": {
    "fr": "Français",
    "en": "English"
  },
  "language": "Language:",
  "or": "or",
  "orMaj": "Or",
  "close": "Close",
  "reset": "Reset",
  "update": {
    "updateAvailable": "An update of the application is available",
    "version": "Version",
    "of": "of",
    "current": "You currently have the version",
    "versionDate": "{{date, MM/DD/YYYY}}",
    "download": "Download the update",
    "getURL": "Get the URL of the download",
    "getChanges": "Get the list of changes",
    "URLToDownload": "Download URL:",
    "noChanges": "No change filled.",
    "changes": "Changes in the new version:"
  },
  "heading": {
    "connectionError": "A connection error has occurred when loading some data. Check your Internet connection then",
    "connectionErrorRetry": "click here to try to reload the data",
    "connectionErrorReload": "refresh the page",
    "connectionErrorInfo": "If you use this application locally and due to technical limitations, the data loading is blocked, which will prevent some functions from working (Vocoder, Reverb). In this case,",
    "connectionErrorOnline": "use the online version",
    "description": "Simple Voice Changer lets you to edit the voice of an audio file or a recording quicly and easily: choose an audio file, or record your voice, and then you can edit and save! All the audio processing is made on your device and no data is sent over the Internet."
  },
  "loading": {
    "loading": "Loading…",
    "audioLoading": "Loading audio data:",
    "errorLoadingTooltip": "An error has occurred loading some data. This function is unavailable. Try to refresh the page (F5)."
  },
  "firstStep": {
    "first": "st",
    "title": "step: select an audio file, or record your voice",
    "errorLoadingFile": "An error has occurred when loading the selected file.",
    "selectFile": "Select an audio file",
    "record": "Record with the microphone"
  },
  "firstStepBis": {
    "title": "step bis: record your voice",
    "error": "An error has occurred when connecting to the input device. Make sure that you have allowed the access and that you have a connected and working input device, then retry.",
    "info": "Allow the access to the microphone on the notification that appeared on your web browser.",
    "description": "You can now record your voice with your microphone. Press Start to begin, and press Stop when you have finished to begin to edit your voice. You can also pause your recording when you want.",
    "audioFeedback": "Audio feedback",
    "autoGain": "Automatic gain",
    "echoCancellation": "Echo cancellation",
    "noiseSuppression": "Noise suppression",
    "audioInput": "Input source:",
    "start": "Start",
    "pause": "Pause",
    "stop": "Stop",
    "duration": "Record duration:",
    "cancel": "Cancel"
  },
  "secondStep":  {
    "loadingFile": "Loading… Please wait."
  },
  "thirdStep": {
    "otherFile": "Choose another file or recording",
    "nb": "nd",
    "title": "step: edit and test",
    "play": "Play",
    "pause": "Pause",
    "stop": "Stop",
    "loopPlay": "Loop playback",
    "processing": "Processing… Please wait.",
    "pitch": "Pitch:",
    "lowPitch": "Low",
    "highPitch": "High",
    "speed": "Speed:",
    "slow": "Slow",
    "fast": "Fast",
    "reverb": "Reverberation",
    "echo": "Echo",
    "vocoder": "Vocoder (robotic voice)",
    "returnAudio": "Reverse the audio",
    "bitCrusher": "8 bits effect",
    "lowpass": "Low-pass filter",
    "highpass": "High-pass filter",
    "bassboost": "Bass boost",
    "phone": "Phone call",
    "limiter": "Limiter (reduces distortion/saturation, recommended)",
    "compatibilityMode": "Compatibility mode (check if no sound is played)",
    "compatibilityModeAuto": "Automatically detected and enabled",
    "infosCompatibilityMode": "This mode also allows you to edit the sound in real time",
    "validate": "Validate",
    "random": "Random settings",
    "reset": "Reset"
  },
  "lastStep": {
    "rd": "rd",
    "title": "step: save your changes",
    "description": "Don't forget to click on Validate to confirm your changes before saving. The save will be in WAV format (uncompressed).",
    "saving": "Saving… Please wait. Your changes will be downloaded shortly.",
    "delay": "The save will end in approximately",
    "delayInfo": "There is a delay because the compatibility mode is enabled.",
    "infosCompatibilityMode": "You can also edit the saved sound in real time.",
    "save": "Save",
    "cancel": "Cancel"
  },
  "footer": {
    "by": "By",
    "download": "Download the project",
    "readme": "Readme file",
    "github": "Github repository",
    "browserCompatibility": "Show the compatible web browsers",
    "version": "Version"
  },
  "compatibility": {
    "title": "Compatible web browsers",
    "lead": "Simple Voice Changer is compatible with the following browsers (mobiles versions included):",
    "chrome": "Chrome, Chromium and others browsers based on Chromium (Opera, Vivaldi, etc.)",
    "issuesTitle": "Known issues:",
    "issue1": "The save of the changes fail on Firefox and Microsoft Edge because of a bug with these browsers (for example",
    "issue1Link": "on Firefox",
    "issue1Last": "The application use a compatibility mode to work around this bug, the save can take more time. This problem doesn't affect Chrome, Chromium and others browsers based on Chromium.",
    "issue2": "If the sound card of your device is set to 192 KHz or higher (sample rate), the Vocoder will work badly. Set it to 92 KHz or less in this case. In most cases, you should not worry about this because most devices are set to 44 kHz or 48 kHz by default."
  },
  "limiterSettings": {
     "title": "Limiter settings",
     "lead": "Here you can set the limiter settings. The default settings have been tested with many audio files and work in most cases.",
     "preGain": "Pre-gain (in dB):",
     "postGain": "Post-gain (in dB):",
     "attackTime": "Attack time (in seconds):",
     "releaseTime": "Release time (in seconds):",
     "threshold": "Threshold (in dB):",
     "lookAheadTime": "Look-ahead time (in seconds):"
  },
  "bassBoostSettings": {
     "title": "Bass boost settings",
     "lead": "Here you can set the bass boost settings.",
     "frequencyBooster": "Boost frequency (boosts equal frequencies or below - in Hz):",
     "dbBooster": "Boost gain (in dB):",
     "frequencyReduce": "Attenuation frequency (attenuates frequencies above - in Hz):",
     "dbReduce": "Attenuation gain (in dB):"
  },
  "highPassSettings" : {
     "title": "High-pass filter settings",
     "lead": "Here you can set the high-pass filter settings.",
     "frequencyHighPass": "Cutoff frequency (in Hz):"
  },
  "lowPassSettings" : {
     "title": "Low-pass filter settings",
     "lead": "Here you can set the low-pass filter settings.",
     "frequencyLowPass": "Cutoff frequency (in Hz):"
  },
  "delaySettings": {
     "title": "Echo filter settings",
     "lead": "Here you can set the echo filter settings.",
     "delaySeconds": "Delay (in seconds):",
     "delayGain": "Gain (in dB):"
  },
  "reverbSettings": {
     "title": "Reverb filter settings",
     "lead": "Here you can set the reverb filter settings.",
     "environmentReverb": "Environment:",
     "environmentSize": "Environment size:",
     "unit": {
         "byte": "B",
         "kilobyte": "KB",
         "megabyte": "MB",
         "gigabyte": "GB"
     },
     "source": "Source",
     "environmentSettingsInfos": "By clicking on Validate, the environment will be temporarily downloaded to your device. This may incur fees.",
     "environmentAlreadyDownloaded": "This environment has already been downloaded.",
     "environmentAlreadyDownloadedLowQuality": "This environment has been downloaded in a low quality version for performance reasons. Click on Validate to download the higher quality version.",
     "loading": "Loading the environment… Please wait.",
     "error": "An error occurred while loading the environment. Try again."
  },
  "script": {
    "errorAudioContext": "Error when creating Audio Context (the Web Audio API seem to be unsupported):",
    "webAudioNotSupported": "Web Audio API not supported by this browser.",
    "workersNotSupported": "Workers are not supported by this browser.",
    "notAvailableCompatibilityMode": "Unavailable in compatibility mode.",
    "notCompatible": "Sorry, this function isn't compatible with your web browser.",
    "notAvailable": "Sorry, this function is currently unavailable.",
    "errorOccured": "An error has occurred.",
    "invalidPitch": "Pitch value invalid!",
    "invalidSpeed": "Speed value invalid!",
    "launchReset": "Your unsaved changes will be lost. Are your sure that you want to choose another file or recording?",
    "browserNotCompatible": "Sorry, your browser isn't compatible with this application. Update it, then try again.",
    "appClosing": "If you close this page, you will definitely lose all your changes. Are you sure that you want to quit this page?",
    "workersErrorLoading": "An error occurred while starting the save. Saving when compatibility mode is disabled doesn't work locally. Try using the online version."
  }
}, true, false);
