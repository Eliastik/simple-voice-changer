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

* [x] - Simplify 8-bit effect settings
* [x] - Implements setting for Vocoder
* [x] - Transform the "lib" folder into a library (new Github repository)
    * [x] Watch mode for the library (auto build when changing file)?
    * [x] Fix copy of worklets when using npm link
* [x] - Other minor fixes :
    * [x] - When disabling limiter and then restarting audio player, the limiter seems to be working
    * [x] - Limiter pre-gain is taken into account even when the filter is disabled
    * [x] - "Record with the microphone" feature not working on Firefox when changing the sample rate
* [x] - Send custom audio buffer environment for the reverb filter
* [x] - Components library: allow to add custom filters (FilterService + interface)

### Future version - 2.1.2 or 2.2.0

* [x] - Display processing progress: maybe using a worklet counting processed audio samples / estimated total samples of the audio?
    * [x] Fix: display estimated remaining time
* [x] - Cancel audio processing (disconnect node and ignore callback from processAudio)
    * [ ] - Display information message when canceling initial audio processing
* [ ] - Don't do the initial audio processing (when choosing an audio file) - can be reenabled in the settings
* [ ] - Use space key to pause/play audio

#### Issues to fix

* [ ] - (Minor) Bug when playing audio in compatibility mode then disabling compatibility mode, then processing audio: the audio keep playing without sound

#### Known issues to fix

* [x] - (Minor) 8-bit effect randomly crash in compatibility mode when changing filter settings
* [x] - (Minor) No error message when no microphone is found for the recorder. Display an error message to fix the issue
* [x] - (Minor) Enable reverb filter when choosing custom environment, and no other environment was downloaded (network error)
* [ ] - (Medium) Bug when changing recorder settings on Chrome mobile
* [ ] - (Very minor) Fix sourcemaps for libraries + worklets copy (cache)
* [ ] - (Major) Fix Soundtouch Worklet audio speed adjustment not working (as now, fallback to classic script processor node, not working in Firefox) - use another library for time stretch?
    * [ ] - If fixed: enable Soundtouch Worklet in compatibility/direct mode
* [ ] - (Medium) Vocoder doesn't work well on sample rate > 96,000 Hz

### Would be good but not important

* [ ] Save/download rendered audio in other formats (MP3, WAV)?
* [ ] - Create new filters (equalizer?, volume/gain?)
    * [ ] - If adding new filters: hide some advanced filters, and make possible to add them if needed in the UI
* [ ] - Save into localstorage filters settings + filter presets that can be set by the user?
* [ ] - Use dependency injection instead of Singleton?
* [ ] - Enhance limiter?
* [ ] - Filter "Autotuner"?
* [ ] - Save into localstorage filters settings?
* [ ] - Graphical visualization of audio + apply filters in a portion of the audio?
* [ ] - Real-time filters editing when recording audio (reuse existing filters)?
* [ ] - Advanced settings for audio channel number? By default use the number of channel of the host if possible (but some filters force 2-channel)
    * Soundtouch limit the possibility to use more than 2 channels
* [ ] - Optimize performance: split processing into smaller chunks + threaded (Worker, not yet possible)

### Other

- Rename app to "Simple Sound Studio"?
