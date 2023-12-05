# To-do list / Roadmap 2.0


## Principal

### 2.0.1

* [x] - Migrate to Audio Worklets (Limiter/Bitcrusher)
* [x] - Disable microphone button from the homepage if not available (not secure context)
* [x] - Fix OfflineAudioContext mode in Firefox (with Audio Worklets)
* [x] - Migrate to Audio Worklets version for Soundtouch
* [x] - Display audio render errors
* [x] - Fix building of audio worklets (imports)
* [ ] - Limiter worklet: Regression with look ahead

### 2.1
* [ ] - Audio Worklet fixes :
    * [ ] - Fix audio speed adjustment not working (as now, fallback to classic script processor node, not working in Firefox)
    * [ ] - Use Audio Worklet in compatibility/direct mode
* [ ] - Advanced settings for the app: sample rate, buffer size, audio channels number, disable/enable audio worklet
* [ ] - Send custom audio buffer environment for the reverb filter
* [ ] - Convert Vocoder to standard filter
* [ ] - Edit volume/gain

### Other
* [ ] - Transform the "classes" folder into a library (new Github repository)

### Future versions
* [ ] - Split processing into smaller chunks + threaded (Worker, not yet possible) + display processing progress

## Would be good but not important

* [ ] - Enhance limiter
* [ ] - Filter "Autotuner"?
* [ ] - Save into localstorage filters settings?
* [ ] - Graphical visualization of audio + apply filters in a portion of the audio?
