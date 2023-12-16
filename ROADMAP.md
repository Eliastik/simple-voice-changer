# To-do list / Roadmap 2.0


## Principal

### 2.0.1

* [x] - Migrate to Audio Worklets (Limiter/Bitcrusher)
* [x] - Disable microphone button from the homepage if not available (not secure context)
* [x] - Fix OfflineAudioContext mode in Firefox (with Audio Worklets)
* [x] - Migrate to Audio Worklets version for Soundtouch
* [x] - Display audio render errors
* [x] - Fix building of audio worklets (imports)
* [x] - Bundle SoundtouchWorkletProcessor
* [x] - Audio worklet memory optimizations
* [x] - Option to disable/enable audio worklet
    * [x] - AudioWorklet polyfill to ScriptProcessorNode
* [x] - Limiter worklet: Regression with look ahead + increase audio length with look ahead time + performance
    * [ ] - Optimize default look-ahead value
* [ ] - Convert Vocoder to standard filter

### 2.1

* [ ] - Advanced settings for the app: sample rate, buffer size (for scriptprocessornode), audio channels number
* [ ] - Audio Worklet fixes (Soundtouch only) :
    * [ ] - Early audio cutoff fix (when lowering frequency) + bug at audio start with lowering frequency
    * [ ] - Fix audio speed adjustment not working (as now, fallback to classic script processor node, not working in Firefox)
    * [ ] - Use Audio Worklet in compatibility/direct mode
* [ ] - Send custom audio buffer environment for the reverb filter
* [ ] - Edit volume/gain

### Other
* [ ] - Transform the "classes" folder into a library (new Github repository)

### Future versions
* [ ] - Split processing into smaller chunks + threaded (Worker, not yet possible) + display processing progress

## Would be good but not important

* [x] - Fallback from Audio Worklets to ScriptProcessorNode for Limiter/Bitcrusher if there is an error loading worklet file
* [ ] - Enhance limiter
* [ ] - Filter "Autotuner"?
* [ ] - Save into localstorage filters settings?
* [ ] - Graphical visualization of audio + apply filters in a portion of the audio?
