# To-do list / Roadmap 2.0


## Principal

* [x] - Migrate to Audio Worklets (Limiter/Bitcrusher)
* [x] - Disable microphone button from the homepage if not available (not secure context)
* [ ] - Fix OfflineAudioContext mode in Firefox
* [x] - Migrate to Audio Worklets version for Soundtouch
    * [ ] - Fix performance when running multiple render (clean old worklets)
    * [ ] - Bug with Firefox - No sound (Audio Worklet)
    * [ ] - Use SharedArrayBuffer if possible
* [ ] - Advanced settings for the app: sample rate, buffer size, audio channels number
* [ ] - Send custom audio buffer environment for the reverb filter
* [ ] - Convert Vocoder to standard filter
* [ ] - Transform the "classes" folder into a library (new Github repository)
* [ ] - Edit volume/gain
* [ ] - Split processing into smaller chunks + threaded (Worker, not yet possible) + display processing progress

## Would be good but not important

* [ ] - Enhance limiter
* [ ] - Filter "Autotuner"?
* [ ] - Save into localstorage filters settings?
* [ ] - Graphical visualization of audio + apply filters in a portion of the audio?
