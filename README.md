# Simple Voice Changer

<img src="https://raw.githubusercontent.com/Eliastik/simple-voice-changer/master/screenshot.png" width="640" alt="Screenshot" />

# English

Simple Voice Changer lets you to edit the voice of an audio file or a recording quicly and easily: choose an audio file, or record your voice, and then you can edit and save! All the audio processing is made on your device and no data is sent over the Internet.

This application uses my libraries [simple-sound-studio-lib](https://github.com/Eliastik/simple-sound-studio-lib) and [simple-sound-studio-components](https://github.com/Eliastik/simple-sound-studio-components). A large part of the application's useful code is therefore present on these two projects.

This program uses the Web Audio API. A browser supporting this API is therefore necessary.

* Online version: [www.eliastiksofts.com/simple-voice-changer/demo](http://www.eliastiksofts.com/simple-voice-changer/demo/)
* Github repository: [https://github.com/Eliastik/simple-voice-changer](https://github.com/Eliastik/simple-voice-changer)

## About

* Version: 2.2.1 (9/10/2024)
* Made in France by Eliastik - [eliastiksofts.com](http://eliastiksofts.com) - Contact : [eliastiksofts.com/contact](http://eliastiksofts.com/contact)
* License: GNU GPLv3 (see the LICENCE.txt file)

### Technologies

* TypeScript
* React
* NextJS
* Tailwind CSS / DaisyUI
* Web Audio API

### Credits

* See package.json file for the dependencies
* Uses [Impulse Response](https://en.wikipedia.org/wiki/Impulse_response) audio files (used for the Reverberation function) [from here](http://www.cksde.com/p_6_250.htm) (Medium Damping Cave E002 M2S) and [here](https://openairlib.net/?page_id=36) (source link in the app reverb settings)
* Uses [an icon](https://www.flaticon.com/free-icon/microphone_204320) by [Prosymbols](https://www.flaticon.com/authors/prosymbols) from [www.flaticon.com](https://www.flaticon.com/) under [CC 3.0 BY](http://creativecommons.org/licenses/by/3.0/) license
* Uses some icons from [Heroicons](https://heroicons.com/) under the MIT License
* Uses some icons from [Font Awesome](https://fontawesome.com/) - [License](https://github.com/FortAwesome/Font-Awesome/blob/6.x/LICENSE.txt)

## Changelog

* Version 2.2.1 (9/10/2024):
    - Added the ability to open multiple audio files at once. Audios can be browsed in the interface. It's also possible to loop through the list of audios.
    - Bug fixes and technical improvements:
        - Bug fixes with the "Enable initial audio rendering" and "Compatibility mode" settings;
        - Added unit tests and E2E (interface) tests with Playwright;
        - Code architecture improvements (library side), dependency injection, code separations, refactoring, etc.;
        - Dependency updates;
        - Other bug fixes, minor text corrections.

* Version 2.2.0 (3/31/2024):
    - The percentage of audio processing as well as the estimated remaining audio processing time is now displayed in the "Audio processing in progress" popup;
    - It's now possible to cancel audio processing in progress;
    - When opening an audio file, no initial processing is now performed at the beginning, to speed up application use. This behavior can be reactivated from the settings;
    - Modified audio can now be saved in MP3 format;
    - It's now possible to pause or play audio by pressing the Space key;
    - Small adjustments have been made to the user interface (larger buttons on larger screens, for example);
    - Bug fixes:
        - An error message is now displayed if no microphone has been found when clicking on the "Record via microphone" button from the application's home screen;
        - Fixed a rare crash with the 8-bit Effect filter;
        - Fixed a bug in the audio player when compatibility mode was disabled and audio processing launched, or when the sampling frequency was modified;
        - Minor code improvements;
        - Dependencies updated.

* Version 2.1.1 (08/02/2024) :
    - Enhanced filters:
        - It's now possible to import a custom environment for the Reverb filter;
        - It's now possible to edit the settings of the Vocoder filter to change its sound;
        - The settings of the 8-bit effect filter have been simplified
    - The application has been split into two libraries: [simple-sound-studio-lib](https://github.com/Eliastik/simple-sound-studio-lib) and [simple-sound-studio-components](https://github.com/Eliastik/simple-sound-studio-components), to make it easier to maintain and more modular. It can also be used on other projects (e.g. my [memes-soundbox](https://github.com/Eliastik/memes-soundbox) project).
    - Bug fixes and other minor improvements:
        - Fixed application of on/off status to Limiter and 8-bit effect filters;
        - Fixed a bug where the Limiter "Pre-gain" setting was applied despite the filter being disabled;
        - Fixed a bug when resetting Reverb filter settings;
        - Fixed a bug where, when a sampling frequency other than that of the system was selected in the advanced settings, the Record with the microphone functionality no longer worked under Firefox, with an error message. This is now possible;
        - Other minor technical improvements to the code have been made, updating all dependencies

* Version 2.1 (12/31/2023):
    - This version has seen a lot of changes under the hood, meaning technical improvements and bug fixes.
    - Among the technical improvements:
        - Migration to the AudioWorklet API instead of the obsolete ScriptProcessorNode API, which also enhances performance;
        - The "Limiter," "8-bit Effect," and "Change speed / frequency" filters (only for frequency modification) have been ported to the AudioWorklet API;
        - The recorder (Recorderjs) has also been ported to the AudioWorklet API;
        - If an issue occurs when the application uses AudioWorklet, the application fallback to ScriptProcessorNode as a last resort (thanks to an adapter between the two APIs);
        - The direct/compatibility rendering mode still uses the ScriptProcessorNode API for the "Change speed / frequency" filter for now;
        - The Vocoder has been migrated to TypeScript;
        - Code quality has been improved: the use of TypeScript "any" has been limited, among other enhancements.
    - Advanced settings have been added:
        - Ability to modify the sampling rate;
        - Ability to disable the use of the AudioWorklet API (and revert to the ScriptProcessorNode API);
        - Ability to set the buffer size.
    - Among the bug fixes:
        - Under Firefox, the initial use of the application would systematically enable compatibility mode due to a bug in this browser. This is no longer the case (especially thanks to the transition to the AudioWorklet API);
        - The interface of the "Record with the microphone" function has been fixed on mobile;
        - In some cases, the use of the "Record with the microphone" function (in insecure contexts) was not possible, but the button was not grayed out; this has been fixed;
        - In case of an error during audio rendering, an error message is displayed; this was not the case before;
        - The rendering of the "Limiter" filter has been fixed;
        - The Vocoder has been transformed into a classic filter, allowing it to be enabled/disabled at will in direct/compatibility rendering mode;
        - If an error occurred during the initial application data download, some filters (e.g., the "Reverb" filter) could be disabled;
        - Bug fix when modifying settings for the "Record with the microphone" feature;
        - The "Limiter" filter is now the last filter in the audio chain, improving the direct/compatibility rendering mode;
        - Other minor bugs have been fixed.

* Version 2.0 (11/16/2023) :
    - The application has been (almost) entirely rewritten in TypeScript/React to improve code quality and modularity
    - The application's UI has been completely redesigned from scratch to take advantage of this technical overhaul, using Tailwind CSS and the DaisyUI component library
    - All features of version 1.4 have been carried over unchanged
    - A dark mode has been added
    - The application is now fully responsive

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

Cette application utilise mes bibliothèques logicielles [simple-sound-studio-lib](https://github.com/Eliastik/simple-sound-studio-lib) and [simple-sound-studio-components](https://github.com/Eliastik/simple-sound-studio-components). Une grande partie du code utile à l'application est donc présent sur ces deux projets.

Ce programme utilise la Web Audio API. Un navigateur supportant cette API est donc nécessaire. Quasiment tous les navigateurs récents la supporte en date du 23/04/2019 (sauf Internet Explorer).

* Version en ligne de ce programme : [www.eliastiksofts.com/simple-voice-changer/demo](http://www.eliastiksofts.com/simple-voice-changer/demo/)
* Dépôt Github : [https://github.com/Eliastik/simple-voice-changer](https://github.com/Eliastik/simple-voice-changer)

## À propos du programme

* Version du programme : 2.2.1 (10/09/2024)
* Made in France by Eliastik - [eliastiksofts.com](http://eliastiksofts.com) - Contact : [eliastiksofts.com/contact](http://eliastiksofts.com/contact)
* Licence : GNU GPLv3 (voir le fichier LICENCE.txt)

### Technologies

* TypeScript
* React
* NextJS
* Tailwind CSS / DaisyUI
* Web Audio API

### Crédits

* Voir les dépendences du fichier package.json
* Utilise des fichiers audio [Impulse Response](https://en.wikipedia.org/wiki/Impulse_response) (utilisés pour la fonction Réverbération) [venant d'ici](http://www.cksde.com/p_6_250.htm) (Medium Damping Cave E002 M2S) et [ici](https://openairlib.net/?page_id=36) (lien vers la source dans les paramètres de la fonction Réverbération de l'application)
* Utilise [une icône](https://www.flaticon.com/free-icon/microphone_204320) réalisée par [Prosymbols](https://www.flaticon.com/authors/prosymbols) de [www.flaticon.com](https://www.flaticon.com/) sous licence [CC 3.0 BY](http://creativecommons.org/licenses/by/3.0/)
* Utilise des icônes venant de chez [Heroicons](https://heroicons.com/) sous licence MIT
* Utilise des icônes venant de chez [Font Awesome](https://fontawesome.com/) - [Licence](https://github.com/FortAwesome/Font-Awesome/blob/6.x/LICENSE.txt)

## Journal des changements

* Version 2.2.1 (10/09/2024) :
    - Ajout de la possibilité d'ouvrir plusieurs fichiers audio à la fois. Il est possible de naviguer à travers les audios dans l'interface. Il est également possible de lire en boucle la liste des audios.
    - Corrections de bugs et améliorations techniques :
        - Correction de bugs avec le paramétrage "Activer le rendu audio initial" et "Mode de compatibilité" ;
        - Ajout de tests unitaires et tests E2E (d'interface) avec Playwright ;
        - Amélioration de l'architecture du code (côté librairie), injection de dépendances, séparations du code, refactoring, notamment ;
        - Mises à jour des dépendances ;
        - Correction d'autres bugs, corrections mineures de textes

* Version 2.2.0 (31/03/2024) :
    - Le pourcentage de traitement audio ainsi que le temps de traitement audio restant estimé s'affiche désormais dans la popup "Traitement audio en cours" ;
    - Il est désormais possible d'annuler un traitement audio en cours ;
    - Lors de l'ouverture d'un fichier audio, aucun traitement initial n'est désormais effectué au début pour accélérer l'utilisation de l'application. Ce comportement peut être réactivé depuis les paramètres ;
    - Il est désormais possible de sauvegarder l'audio modifié au format MP3 ;
    - Il est désormais possible de mettre en pause ou de jouer l'audio en appuyant sur la touche Espace ;
    - Des petits ajustements de l'interface utilisateur ont été apportés (boutons plus gros sur les grands écrans par exemple) ;
    - Correction de bugs :
        - Un message d'erreur s'affiche désormais si aucun microphone n'a été trouvé lors du clic sur le bouton "Enregistrer via le micro" depuis l'écran d'accueil de l'application ;
        - Correction d'un plantage rare avec le filtre Effet 8-bit ;
        - Correction d'un bug du lecteur audio lorsque le mode de compatibilité était désactivé puis un traitement audio lancé, ou lorsque la fréquence d'échantillonage était modifiée ;
        - Petites améliorations mineures du code ;
        - Mise à jour des dépendances.

* Version 2.1.1 (08/02/2024) :
    - Amélioration de certains filtres :
        - Il est désormais possible d'importer un environnement personnalisé pour le filtre Reverbération ;
        - Il est désormais possible de modifier les paramètres du filtre Vocodeur pour modifier sa sonorité ;
        - Les paramètres du filtre Effet 8-bit ont été simplifiés
    - L'application a été découpée en deux librairies : [simple-sound-studio-lib](https://github.com/Eliastik/simple-sound-studio-lib) et [simple-sound-studio-components](https://github.com/Eliastik/simple-sound-studio-components), pour faciliter sa maintenance et la rendre plus modulaire. Elle peut aussi être utilisée sur d'autres projets (par exemple sur mon projet [memes-soundbox](https://github.com/Eliastik/memes-soundbox)
    - Correction de bugs et autre améliorations mineures :
        - Correction de l'application de l'état activé/désactivé aux filtres Limiteur et Effet 8-bit (basés sur AudioWorklet) ;
        - Correction d'un bug où le paramètre "Pré-gain" du Limiteur était appliquée malgré que le filtre était désactivé ;
        - Correction d'un bug lors de la réinitialisation des paramètres du filtre Reverbération ;
        - Correction d'un bug où, lorsqu'une fréquence d'échantillonage différente de celle du système était choisie dans les paramètres avancés, la fonctionnalité Enregistrer via le micro ne fonctionnait plus sous Firefox, avec un message d'erreur. Cela est déosrmais possible ;
        - D'autres améliorations mineures techniques du code ont été apportées, mise à jour de toutes les dépendances

* Version 2.1 (31/12/2023) :
    - Cette version a vu beaucoup de changements sous le capot, c'est-à-dire des améliorations techniques et corrections de bugs.
    - Parmi les améliorations techniques :
        - Migration vers l'API AudioWorklet au lieu de l'API ScriptProcessorNode qui est obsolète, cela améliore également les performances ;
        - Les filtres "Limiteur", "Effet 8-bit" et "Modifier la vitesse / fréquence" (uniquement pour la modification de la fréquence) ont été portés vers l'API AudioWorklet ;
        - L'enregistreur (Recorderjs) a aussi été porté vers l'API AudioWorklet ;
        - Si un problème a lieu lorsque l'application utilise les AudioWorklet, l'application bascule en dernier recours vers les ScriptProcessorNode (grâce à un adapteur entre les deux API) ;
        - Le mode de rendu direct/compatibilité utilise encore l'API ScriptProcessorNode pour le filtre "Modifier la vitesse / fréquence" pour le moment ;
        - Le Vocoder a été migré vers TypeScript ;
        - La qualité du code a été améliorée : l'utilisation du "any" TypeScript a été limitée, d'autres améliorations ont été apportées.
    - Des paramètres avancés ont été ajoutés :
        - Possibilité de modifier la fréquence d'échantillonage ;
        - Possibilité de désactiver l'utilisation de l'API AudioWorklet (et de revenir à l'API ScriptProcessorNode) ;
        - Possibilité de paramétrer la taille de tampon.
    - Parmi les corrections de bugs :
        - Sous Firefox, l'utilisation initiale de l'application activait systématiquement le mode de compatibilité à cause d'un bug sur ce navigateur. Cela n'est désormais plus le cas (notamment grâce au passage vers l'API AudioWorklet) ;
        - L'interface de la fonction Enregistrer via le micro a été corrigée sur mobile ;
        - Dans certains cas, l'utilisation de la fonction Enregistrer via le micro (dans les contextes non sécurisés) n'était pas possible mais le bouton n'était pas grisé, cela a été corrigé ;
        - En cas d'erreur lors du rendu audio, un message d'erreur est affiché, cela n'était pas le cas auparavant ;
        - Le rendu du filtre "Limiteur" a été corrigé ;
        - Le Vocodeur a été transformé en filtre classique, il peut ainsi être activé/désactivé à volonté en mode de rendu direct/compatibilité ;
        - Si une erreur est survenue lors du téléchargement des données initiales de l'application, certains filtres (par exemple le filtre "Réverbération") peuvent être désactivés ;
        - Correction d'un bug lors de la modification des paramètres de la fonction "Enregistrer via le micro" ;
        - Le filtre "Limiteur" est le dernier filtre de la chaîne audio, ce qui améliore le mode de rendu direct/compatibilité ;
        - D'autres bugs mineurs ont été corrigés.

* Version 2.0 (16/11/2023) :
    - L'application a été (quasiment) entièrement réécrite en TypeScript/React pour en améliorer la qualité de code, et pour améliorer sa modularité
    - L'interface de l'application a été totalement refaite de 0 en profitant de cette refonte technique, avec Tailwind CSS et la bilbiothèque de composants DaisyUI
    - Toutes les fonctionnalités de la version 1.4 ont été reprises à l'identique
    - Un mode sombre a été ajouté
    - L'application est désormais entièrement responsive

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

## Déclaration de licence

Copyright (C) 2019-2023 Eliastik (eliastiksofts.com)

Ce programme est un logiciel libre ; vous pouvez le redistribuer ou le modifier suivant les termes de la GNU General Public License telle que publiée par la Free Software Foundation ; soit la version 3 de la licence, soit (à votre gré) toute version ultérieure.

Ce programme est distribué dans l'espoir qu'il sera utile, mais SANS AUCUNE GARANTIE ; sans même la garantie tacite de QUALITÉ MARCHANDE ou d'ADÉQUATION à UN BUT PARTICULIER. Consultez la GNU General Public License pour plus de détails.

Vous devez avoir reçu une copie de la GNU General Public License en même temps que ce programme ; si ce n'est pas le cas, consultez http://www.gnu.org/licenses.

----

Copyright (C) 2019-2023 Eliastik (eliastiksofts.com)

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program. If not, see http://www.gnu.org/licenses/.
