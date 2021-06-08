# Simple Voice Changer

<img src="https://raw.githubusercontent.com/Eliastik/simple-voice-changer/master/screenshot.png" width="640" alt="Screenshot" />

# English

Simple Voice Changer lets you to edit the voice of an audio file or a recording quicly and easily: choose an audio file, or record your voice, and then you can edit and save! All the audio processing is made on your device and no data is sent over the Internet.

This program uses the Web Audio API. A browser supporting this API is therefore necessary. Almost all recent browsers support it as of 23/04/2019 (except Internet Explorer).

* Online version: [www.eliastiksofts.com/simple-voice-changer/demo](http://www.eliastiksofts.com/simple-voice-changer/demo/)
* Github repository: [https://github.com/Eliastik/simple-voice-changer](https://github.com/Eliastik/simple-voice-changer)

## About

* Version: 1.4 (01/21/2021)
* Made in France by Eliastik - [eliastiksofts.com](http://eliastiksofts.com) - Contact : [eliastiksofts.com/contact](http://eliastiksofts.com/contact)
* License: GNU GPLv3 (see the LICENCE.txt file)

### Credits

* Uses the Bootstrap theme Cosmo from Bootswatch ([https://bootswatch.com/3/cosmo/](https://bootswatch.com/3/cosmo/)), under [MIT](https://tldrlegal.com/license/mit-license) license
* Use the icon font [Font Awesome](https://fontawesome.com/v4.7.0/), under [SIL OFL 1.1](https://tldrlegal.com/license/open-font-license-(ofl)-explained) and [MIT](https://tldrlegal.com/license/mit-license) licenses
* Uses the library [Soundtouch.js](https://github.com/ZVK/stretcher/blob/master/soundtouch.js) under [GNU LGPL 2.1](https://www.gnu.org/licenses/old-licenses/lgpl-2.1.fr.html) license
* Uses the library [Vocoder.js](https://github.com/jergason/Vocoder) under [MIT](https://github.com/jergason/Vocoder/blob/master/LICENSE.txt) license (slightly modified code)
* Uses the library [Recorderjs](https://github.com/Eliastik/Recorderjs) (forked) and its [Worker version](https://github.com/mattdiamond/Recorderjs/blob/ac0eb8a7c2601fc4ec1cbd1b1ee49f45a6c79580/recorderWorker.js) under [MIT](https://tldrlegal.com/license/mit-license) license.
* Uses the library [Boostrap Slider](https://github.com/seiyria/bootstrap-slider), under [MIT](https://github.com/seiyria/bootstrap-slider/blob/master/LICENSE.md) license
* Uses the library [Boostrap Native](https://github.com/thednp/bootstrap.native), under [MIT](https://github.com/thednp/bootstrap.native/blob/master/LICENSE) license
* Uses the library [i18next](https://github.com/i18next/i18next) (with the module [i18next-browser-languageDetector](https://github.com/i18next/i18next-browser-languageDetector)) under [MIT](https://opensource.org/licenses/mit-license.php) license for the translation engine
* Uses [Impulse Response](https://en.wikipedia.org/wiki/Impulse_response) audio files (used for the Reverberation function) [from here](http://www.cksde.com/p_6_250.htm) (Medium Damping Cave E002 M2S) and [here](https://openairlib.net/?page_id=36) (source link in the app reverb settings)
* Uses [an icon](https://www.flaticon.com/free-icon/microphone_204320) by [Prosymbols](https://www.flaticon.com/authors/prosymbols) from [www.flaticon.com](https://www.flaticon.com/) under [CC 3.0 BY](http://creativecommons.org/licenses/by/3.0/) license

## Changelog

* Version 1.4 (21/01/2021) :
    - Improved audio recorder: it's now possible to choose the input device, and change some settings (automatic gain, echo cancellation, noise cancellation, etc.)
    - Better support of audio speed change: the audio player speeds up, previously the audio duration was increased which caused problems when the speed was changed again
    - Settings aren't reseted when changing audio file/recording
    - It's now possible to record audio with the offline version when the compatibility mode is disabled
    - The essential audio files are integrated within the JavaScript file of the application, which allows the Vocoder and the reverb function to work with the version in offline mode
    - A lighter version of the first reverb environment is loaded when the application is launched, which improves performance
    - Added new environments for the reverb function
    - Bug fixes and other adjustments
    - Technical improvements:
        - Use of Webpack and Babel, use of npm to manage dependencies
        - Conversion to ES6
        - Use of the latest versions of dependencies

* Version 1.3.0.1 (3/9/2020) :
    - Small fix of the limiter: the same gain reduction is applied to all audio channels at the same time, this improves the sound quality. The default release time has been increased to 3.

* Version 1.3 (12/28/2019):
    - Many filters can now be configured! This includes the Limiter and the filters Bass boost, Reverberation, Echo, Low-pass filter and High-pass filter;
        - Added many environments for the Reverberation filter, accessible via the settings of this filter;
    - Compatibility mode now have the same audio player as the standard mode. In addition, this mode now allows you to edit the sounds in real time!;
    - Added the possibility to enable loop playback of a sound;
    - Many bug fixes and other improvements of the quality of the application:
        - Optimizations aimed at reducing memory usage and speed of sound processing;
        - Adjustment of the default limiter settings in order to improve the quality;
        - Fixed: the message "A connection error has occurred..." could appear even when no error had occurred;
        - Simplified and commented code;
        - Updated software libraries;
        - Other bug fixes and adjustments.

* Version 1.2.1.2 (7/26/2019):
    - Additions to use the app in offline mode and to be offered installation on compatible platforms;
    - Other corrections.

* Version 1.2.1.1 (7/22/2019):
    - Fixed the Vocoder filter that was not working due to a small error, others fixes.

* Version 1.2.1 (7/18/2019):
    - Bug fixes and compatibility fixes with Microsoft Edge and Safari.

* Version 1.2 (7/17/2019):
    - Added new filters: Echo, Flip the audio, 8 bits effect and High-pass filter;
    - Added an audio limiter (which replaces the audio compressor and works better) to reduce distortion and saturation;
    - Added a Pause button, a playback slider as well as the total length of the audio in minutes:seconds and the elapsed playing time for step 2 (not available in compatibility mode);
    - The Stop button when playing audio (step 2) is now available in compatibility mode;
    - Added a progress bar when saving changes and added the ability to cancel the save (third step) if compatibility mode is enabled;
    - Reverb filter enhanced (Impulse Response audio file changed);
    - Bug fixes and other adjustments.

* Version 1.1 (7/15/2019):
    - Integration of the i18next translation engine and translation of the application into English;
    - Added an update module;
    - Added new effects: Phone Call, Bass Boost and Lowpass Filter;
    - Added a compressor to limit saturation;
    - Bug fixes, code simplifications, libraries update, other adjustments.

* Version 1.0.3 (4/26/2019):
    - Step 2: Added random settings and reset settings.

* Version 1.0.2 (4/23/2019):
    - Better detection of data loading errors;
    - Updated library (Bootstrap Native);
    - Bug fixes, text adjustments and other adjustments.

* Version 1.0.1 (10/04/2019):
    - Addition of a timer when recording via the microphone;
    - Display a confirmation message when refreshing/closing the application;
    - Bug fixes and adjustments.

* Version 1.0 (4/9/2019) :
    - Initial version

# Français

Simple Voice Changer vous permet de modifier la voix d'un fichier audio ou d'un enregistrement rapidement et simplement : choisissez un fichier audio, ou enregistrez-vous, et vous pouvez modifier et enregistrer ! Tout le traitement audio se fait sur votre appareil et aucune donnée n'est envoyée sur Internet.

Ce programme utilise la Web Audio API. Un navigateur supportant cette API est donc nécessaire. Quasiment tous les navigateurs récents la supporte en date du 23/04/2019 (sauf Internet Explorer).

* Version en ligne de ce programme : [www.eliastiksofts.com/simple-voice-changer/demo](http://www.eliastiksofts.com/simple-voice-changer/demo/)
* Dépôt Github : [https://github.com/Eliastik/simple-voice-changer](https://github.com/Eliastik/simple-voice-changer)

## À propos du programme

* Version du programme : 1.4 (21/01/2021)
* Made in France by Eliastik - [eliastiksofts.com](http://eliastiksofts.com) - Contact : [eliastiksofts.com/contact](http://eliastiksofts.com/contact)
* Licence : GNU GPLv3 (voir le fichier LICENCE.txt)

### Crédits

* Utilise le thème Bootstrap Cosmo de Bootswatch ([https://bootswatch.com/3/cosmo/](https://bootswatch.com/3/cosmo/)), sous [licence MIT](https://tldrlegal.com/license/mit-license)
* Utilise la police d'icônes [Font Awesome](https://fontawesome.com/v4.7.0/), sous [licence SIL OFL 1.1](https://tldrlegal.com/license/open-font-license-(ofl)-explained) et [MIT](https://tldrlegal.com/license/mit-license)
* Utilise la bibliothèque logicielle [Soundtouch.js](https://github.com/ZVK/stretcher/blob/master/soundtouch.js) sous [licence GNU LGPL 2.1](https://www.gnu.org/licenses/old-licenses/lgpl-2.1.fr.html)
* Utilise la bibliothèque logicielle [Vocoder.js](https://github.com/jergason/Vocoder) sous [licence MIT](https://github.com/jergason/Vocoder/blob/master/LICENSE.txt) (code légèrement modifié)
* Utilise la bibliothèque logicielle [Recorderjs](https://github.com/Eliastik/Recorderjs) (forkée) et sa [version Worker](https://github.com/mattdiamond/Recorderjs/blob/ac0eb8a7c2601fc4ec1cbd1b1ee49f45a6c79580/recorderWorker.js) sous [licence MIT](https://tldrlegal.com/license/mit-license).
* Utilise la bibliothèque logicielle [Boostrap Slider](https://github.com/seiyria/bootstrap-slider), sous [licence MIT](https://github.com/seiyria/bootstrap-slider/blob/master/LICENSE.md)
* Utilise la bibliothèque logicielle [Boostrap Native](https://github.com/thednp/bootstrap.native), sous [licence MIT](https://github.com/thednp/bootstrap.native/blob/master/LICENSE)
* Utilise la bibliothèque logicielle [i18next](https://github.com/i18next/i18next) (avec le module [i18next-browser-languageDetector](https://github.com/i18next/i18next-browser-languageDetector)) sous licence [MIT](https://opensource.org/licenses/mit-license.php) pour le moteur de traduction
* Utilise des fichiers audio [Impulse Response](https://en.wikipedia.org/wiki/Impulse_response) (utilisés pour la fonction Réverbération) [venant d'ici](http://www.cksde.com/p_6_250.htm) (Medium Damping Cave E002 M2S) et [ici](https://openairlib.net/?page_id=36) (lien vers la source dans les paramètres de la fonction Réverbération de l'application)
* Utilise [une icône](https://www.flaticon.com/free-icon/microphone_204320) réalisée par [Prosymbols](https://www.flaticon.com/authors/prosymbols) de [www.flaticon.com](https://www.flaticon.com/) sous licence [CC 3.0 BY](http://creativecommons.org/licenses/by/3.0/)

## Journal des changements

* Version 1.4 (21/01/2021) :
    - Amélioration de l'enregistreur audio : il est possible de choisir le périphérique d'entrée, et de modifier certains paramètres (gain automatique, annulation d'écho, suppression de bruit, etc.)
    - Meilleure prise en charge de la modification de la vitesse audio : le lecteur audio accélère, auparavant la durée de l'audio était augmentée ce qui engendrait des problèmes lorsque la vitesse était modifiée à nouveau
    - Les paramètres ne sont pas réinitialisés lors du changement de fichier audio/enregistrement
    - Il est désormais possible d'enregistrer l'audio avec la version en mode hors ligne lorsque le mode de compatibilité est désactivé
    - Les fichiers audio essentiels sont intégrés au sein du fichier JavaScript de l'application, ce qui permet au Vocoder et à la fonction réverbération de fonctionner avec la version en mode hors ligne
    - Une version plus légère du premier environnement de réverbération est chargée au lancement de l'application, ce qui améliore les performances
    - Ajout de nouveaux environnements pour la fonction réverbération
    - Correction de bugs et autres ajustements
    - Amélioration techniques :
        - Utilisation de Webpack et Babel, utilisation de npm pour gérer les dépendances
        - Conversion en ES6
        - Utilisation des dernières versions des dépendances

* Version 1.3.0.1 (09/03/2020) :
    - Petite correction du limiteur : la même réduction de gain est effectuée sur tous les canaux audio en même temps, cela améliore la qualité sonore. De plus, le temps de release a été augmenté à 3 par défaut.

* Version 1.3 (28/12/2019) :
    - De nombreux filtres ont désormais la possibilité d'être paramétrés ! Cela inclus notamment le limiteur, les filtres Boost des basses, Réverbération, Echo, Filtre passe-bas et Filtre passe-haut ;
        - Ajout de nombreux environnements pour le filtre Réverbération, accessibles via les paramètres de ce filtre ;
    - Le mode de compatibilité a désormais le même lecteur audio que le mode standard. De plus, ce mode permet désormais de modifier les sons en temps réel ! ;
    - Ajout de la possibilité de lire en boucle un son ;
    - De nombreuses corrections de bugs et autres améliorations de la qualité de l'application :
        - Optimisations visant à réduire l'utilisation mémoire et la rapidité de traitement des sons ;
        - Ajustement des paramètres par défaut du limiteur afin d'en améliorer la qualité ;
        - Corrigé : le message "Une erreur de connexion est survenue..." pouvait s'afficher même lorsqu'aucune erreur n'était survenue ;
        - Code simplifié et commenté ;
        - Mise à jour des bibliothèques logicielles ;
        - Autres corrections de bugs et ajustements.

* Version 1.2.1.2 (26/07/2019) :
    - Ajout permettant d'utiliser l'application en mode hors-ligne et de se voir proposer l'installation sur les plateformes compatibles ;
    - Autres corrections.

* Version 1.2.1.1 (22/07/2019) :
    - Réparation du filtre Vocoder qui ne fonctionnait plus suite à une petite erreur, autres corrections.

* Version 1.2.1 (18/07/2019) :
    - Corrections de bugs et correction de la compatibilité avec Microsoft Edge et Safari.

* Version 1.2 (17/07/2019) :
    - Ajout de nouveaux filtres : Écho, Retourner l'audio, Effet 8 bits et Filtre passe-haut ;
    - Ajout d'un limiteur audio (qui remplace le compresseur audio et qui fonctionne mieux) pour réduire la distorsion et la saturation ;
    - Ajout d'un bouton Pause, d'un curseur de lecture ainsi que de la longueur totale de l'audio en minutes:secondes ainsi que du temps de lecture écoulé pour l'étape 2 (non disponible en mode de compatibilité) ;
    - Le bouton Stop lors de la lecture de l'audio (étape 2) est désormais disponible en mode de compatibilité ;
    - Ajout d'une jauge de progression lors de l'enregistrement des modifications et ajout de la possibilité d'annuler l'enregistrement (troisième étape) si le mode de compatibilité est activé ;
    - Amélioration du filtre Réverbération (fichier audio Impulse Response changé) ;
    - Corrections de bugs et autres ajustements.

* Version 1.1 (15/07/2019) :
    - Intégration du moteur de traduction i18next et traduction de l'application en anglais ;
    - Ajout d'un module de mise à jour de l'application ;
    - Ajout de nouveaux effets : Appel téléphonique, Boost des basses et Filtre passe-bas ;
    - Ajout d'un compresseur pour limiter la saturation ;
    - Corrections de bugs, simplifications du code, mise à jour des bibliothèques logicielles, autres ajustements.

* Version 1.0.3 (26/04/2019) :
    - Étape 2 : Ajout de la possibilité de tirer au hasard des réglages et de réinitialiser les réglages.

* Version 1.0.2 (23/04/2019) :
    - Meilleure détection des erreurs de chargement des données ;
    - Mise à jour des bibliothèques logicielles (Bootstrap Native) ;
    - Corrections de bugs, ajustements des textes et autres ajustements.

* Version 1.0.1 (10/04/2019) :
    - Ajout d'un minuteur lors de l'enregistrement via le micro ;
    - Affichage d'un message de confirmation lors de l'actualisation/la fermeture de l'application ;
    - Corrections de bugs et ajustements.

* Version 1.0 (09/04/2019) :
    - Version initiale

## TO-DO list

### À faire :

- [ ] Utiliser Audio Worklet -> permet de corriger de nombreux soucis
- [ ] Afficher temps restant quand mode de compatibilité désactivé
- [ ] Transformer l'application en classe réutilisable (permet le point suivant)
- [ ] Fusionner les avancées de ce programme avec [Denis Brogniart – Ah !](https://github.com/Eliastik/ah) et les autres boîtes à son
- [ ] Possibilité de modifier le volume/gain
- [ ] Possibilité d'importer ses propres convolvers audio
- [ ] Visualisation audio graphique
- [ ] (Ajouter encore d'autres effets - autotune essayé)
- [x] ES6 + babel ?
- [x] Choix du micro pour l'enregistrement
- [x] Case à cocher permettant de désactiver la gestion automatique du gain lors de l'enregistrement avec le micro
- [x] (Corrigé) Problème sur Microsoft Edge : la sauvegarde ne fonctionne pas (aucun téléchargement/enregistrement ne fonctionne)
- [x] Corriger message erreur "Application non compatible" sur le bouton "Enregistrer via le micro" si contexte non sécurisé (http, ...)
- [x] Corriger le compresseur audio
- [x] Ajouter plus d'effets
- [x] Traduire l'application en anglais (i18next)

## Déclaration de licence

Copyright (C) 2019-2021 Eliastik (eliastiksofts.com)

Ce programme est un logiciel libre ; vous pouvez le redistribuer ou le modifier suivant les termes de la GNU General Public License telle que publiée par la Free Software Foundation ; soit la version 3 de la licence, soit (à votre gré) toute version ultérieure.

Ce programme est distribué dans l'espoir qu'il sera utile, mais SANS AUCUNE GARANTIE ; sans même la garantie tacite de QUALITÉ MARCHANDE ou d'ADÉQUATION à UN BUT PARTICULIER. Consultez la GNU General Public License pour plus de détails.

Vous devez avoir reçu une copie de la GNU General Public License en même temps que ce programme ; si ce n'est pas le cas, consultez http://www.gnu.org/licenses.

----

Copyright (C) 2019-2021 Eliastik (eliastiksofts.com)

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program. If not, see http://www.gnu.org/licenses/.
