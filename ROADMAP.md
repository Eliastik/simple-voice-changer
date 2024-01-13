# To-do list / Roadmap 2.0


## Principal

### 2.1

* [x] - Migrate to Audio Worklets (Limiter/Bitcrusher)
* [x] - Disable microphone button from the homepage if not available (not secure context)
* [x] - Fix OfflineAudioContext mode in Firefox (with Audio Worklets)
* [x] - Migrate to Audio Worklets version for Soundtouch
* [x] - Display audio render errors
* [x] - Fix building of audio worklets (imports)
* [x] - Bundle SoundtouchWorkletProcessor
* [x] - Audio worklet memory optimizations
* [x] - Fallback from Audio Worklets to ScriptProcessorNode for Limiter/Bitcrusher if there is an error loading worklet file
* [x] - Option to disable/enable audio worklet
    * [x] - AudioWorklet polyfill to ScriptProcessorNode
* [x] - Limiter worklet: Regression with look ahead + increase audio length with look ahead time + performance
    * [x] - Optimize default look-ahead value
* [x] - Convert Vocoder to standard filter
* [x] - Audio Worklet fixes (Soundtouch only) :
    * [x] - Early audio cutoff fix (when lowering frequency) + bug at audio start with lowering frequency
* [x] - Advanced settings for the app: sample rate, buffer size (for scriptprocessornode)
* [x] Make the limiter the last audio filter of the chain
* [x] - Bug hunting
    * [x] Fix audio worklet fallback/polyfill port message not working
    * [x] Fix 8-bit effect
    * [x] Reverb filter: when changing the sample rate, the reverb filter break (due to buffer sample rate not matching)
    * [x] Bug when changing constraints when recording
* [x] - Recorderjs is using ScriptProcessorNode for recording, convert to AudioWorklet

### 2.1.1

* [x] - Transform the "lib" folder into a library (new Github repository)
    * [x] Watch mode for the library (auto build when changing file)?
    * [ ] Fix copy of worklets when using npm link
* [x] - Simplify 8-bit effect settings
* [ ] - Audio Worklet fixes (Soundtouch only) :
    * [ ] - Fix audio speed adjustment not working (as now, fallback to classic script processor node, not working in Firefox)
    * [ ] - Use Audio Worklet in compatibility/direct mode
* [ ] - Other minor fixes :
    * [x] - When disabling limiter and then restarting audio player, the limiter seems to be working
    * [x] - Limiter pre-gain is taken into account even when the filter is disabled
    * [ ] - Vocoder doesn't work well on sample rate > 96,000 Hz
    * [ ] - "Record with the microphone" feature not working on Firefox when changing the sample rate
* [ ] - Send custom audio buffer environment for the reverb filter
* [ ] - Edit volume/gain

### Future versions

* [ ] - Split processing into smaller chunks + threaded (Worker, not yet possible) + display processing progress
    * [ ] Cancel audio processing

## Would be good but not important

* [ ] - Advanced settings for audio channel number? By default use the number of channel of the host if possible (but some filters force 2-channel)
* [ ] - Enhance limiter?
* [ ] - Filter "Autotuner"?
* [ ] - Filter "equalizer"?
* [ ] - If adding new filters: hide some advanced filters, and make possible to add them if needed in the UI
* [ ] - Save into localstorage filters settings?
* [ ] - Graphical visualization of audio + apply filters in a portion of the audio?
* [ ] - Real-time filters editing when recording audio (reuse existing filters)?
