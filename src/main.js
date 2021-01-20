/*
 * Copyright (C) 2019-2021 Eliastik (eliastiksofts.com)
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
import Slider from "bootstrap-slider";
import * as soundtouch from "soundtouchjs";
import i18next from "i18next";
import Limiter from "./Limiter";
import BSN from "bootstrap.native/dist/bootstrap-native.min.js";
import vocoder from "./Vocoder";
import { Recorder, getRecorderWorker } from "recorderjs";
import modulator_mp3 from "../assets/sounds/modulator.mp3";
import impulse_response_default_lite from "../assets/sounds/impulse_response.mp3";
import BufferPlayer from "./BufferPlayer";
import VoiceRecorder from "./VoiceRecorder";
import "./Shim";

// App infos
const filesDownloadName = "simple_voice_changer";
const audioArray = [impulse_response_default_lite, modulator_mp3]; // audio to be loaded when launching the app
const app_version = "1.3.0.1";
const app_version_date = "03/09/2020";
const updater_uri = "https://www.eliastiksofts.com/simple-voice-changer/update.php";
// End of app infos

// Default values
let reverbAudio, echoAudio, compaAudioAPI, vocoderAudio, lowpassAudio, highpassAudio, phoneAudio, returnAudio, bassboostAudio, bitCrusherAudio, compatModeChecked, audioContextNotSupported, audioProcessing, removedTooltipInfo, context;

let speedAudio = 1;
let pitchAudio = 1;
reverbAudio = echoAudio = compaAudioAPI = vocoderAudio = bitCrusherAudio = lowpassAudio = highpassAudio = bassboostAudio = phoneAudio = returnAudio = compatModeChecked = audioContextNotSupported = audioProcessing = removedTooltipInfo = false;
let limiterAudio = true;
let processing_context = null;
// End of the default values

// Check compatibility with Web Audio API
if('AudioContext' in window) {
    try {
        let AudioContext = window.AudioContext || window.webkitAudioContext;
        context = new AudioContext();
    } catch(e) {
        if(typeof(window.console.error) !== "undefined") {
            console.error(i18next.t("script.errorAudioContext"), e);
        } else {
            console.log(i18next.t("script.errorAudioContext"), e);
        }

        audioContextNotSupported = true;
    }
} else {
    audioContextNotSupported = true;
}

// Polyfill navigator.getUserMedia
navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || null);

// Create the sliders (pitch/speed)
const slider = new Slider("#pitchRange", {
    formatter: value => {
        return value;
    }
});

const slider2 = new Slider("#speedRange", {
    formatter: value => {
        return value;
    }
});
// End of create the sliders (pitch/speed)

// Global buffers
const audioBuffers = {
    principal: null,
    returned: null,
    vocoded: null,
    returnedVocoded: null,
    processed: null,
    modulator: null
};
// End of global buffers

// Create Soundtouch objects
const st = new soundtouch.SoundTouch(44100);
const soundtouchFilter = new soundtouch.SimpleFilter();
let soundtouchNode = null;
st.pitch = 1.0;
st.tempo = 1.0;
st.rate = 1.0;
// End of Create Soundtouch objects

const limiter = new Limiter(); // Create an audio limiter
limiter.sampleRate = context.sampleRate;
// Create a VoiceRecorder
const recorderVoice = new VoiceRecorder(context);
recorderVoice.deviceList = document.getElementById("audioInput");
recorderVoice.onInit = function() {
    document.getElementById("waitRecord").style.display = "block";
    document.getElementById("errorRecord").style.display = "none";
};
recorderVoice.onSuccess = function() {
    document.getElementById("errorRecord").style.display = "none";
    document.getElementById("waitRecord").style.display = "none";
    document.getElementById("recordAudioPlay").disabled = false;
    document.getElementById("checkAudioRetour").disabled = false;
    document.getElementById("checkAudioRetourGroup").setAttribute("class", "checkbox");
    document.getElementById("checkAudioNoise").disabled = false;
    document.getElementById("checkAudioNoiseGroup").setAttribute("class", "checkbox");
    document.getElementById("checkAudioGain").disabled = false;
    document.getElementById("checkAudioGainGroup").setAttribute("class", "checkbox");
    document.getElementById("checkAudioEcho").disabled = false;
    document.getElementById("checkAudioEchoGroup").setAttribute("class", "checkbox");
    document.getElementById("audioInput").disabled = false;
};
recorderVoice.onError = function() {
    document.getElementById("errorRecord").style.display = "block";
    document.getElementById("waitRecord").style.display = "none";
    document.getElementById("recordAudioPlay").disabled = true;
    document.getElementById("checkAudioRetour").disabled = true;
    document.getElementById("checkAudioRetourGroup").setAttribute("class", "checkbox disabled");
    document.getElementById("checkAudioNoise").disabled = true;
    document.getElementById("checkAudioNoiseGroup").setAttribute("class", "checkbox disabled");
    document.getElementById("checkAudioGain").disabled = true;
    document.getElementById("checkAudioGainGroup").setAttribute("class", "checkbox disabled");
    document.getElementById("checkAudioEcho").disabled = true;
    document.getElementById("checkAudioEchoGroup").setAttribute("class", "checkbox disabled");
    document.getElementById("audioInput").disabled = true;
};
recorderVoice.onUpdateConstraints = function() {
    document.getElementById("checkAudioGain").checked = recorderVoice.constraints.audio.autoGainControl;
    document.getElementById("checkAudioNoise").checked = recorderVoice.constraints.audio.noiseSuppression;
    document.getElementById("checkAudioEcho").checked = recorderVoice.constraints.audio.echoCancellation;
};
recorderVoice.onRecord = function() {
    document.getElementById("recordAudioPlay").disabled = true;
    document.getElementById("recordAudioPause").disabled = false;
    document.getElementById("recordAudioStop").disabled = false;
    document.getElementById("recordAudioPlay").style.display = "none";
    document.getElementById("recordAudioPause").style.display = "inline-block";
};
recorderVoice.onPause = function() {
    document.getElementById("recordAudioPlay").disabled = false;
    document.getElementById("recordAudioPause").disabled = true;
    document.getElementById("recordAudioPlay").style.display = "inline-block";
    document.getElementById("recordAudioPause").style.display = "none";

    if(recorderVoice.timer.seconds > 0) {
        document.getElementById("recordAudioStop").disabled = false;
    }
};
recorderVoice.onReset = function() {
    document.getElementById("recordAudioPlay").disabled = true;
    document.getElementById("recordAudioPause").disabled = true;
    document.getElementById("recordAudioPlay").style.display = "inline-block";
    document.getElementById("recordAudioPause").style.display = "none";
    document.getElementById("recordAudioStop").disabled = true;
    document.getElementById("checkAudioRetour").checked = false;
    document.getElementById("checkAudioRetour").disabled = true;
    document.getElementById("checkAudioRetourGroup").setAttribute("class", "checkbox disabled");
    document.getElementById("timeRecord").innerHTML = "00:00";
};
recorderVoice.onStop = function(buffer) {
    loadPrincipalBuffer(buffer);
};
 // Create a BufferPlayer
const sliderPlayAudio = new Slider("#playAudioRange"); // Slider used to control the time in the audio BufferPlayer
const audioBufferPlay = new BufferPlayer(context, sliderPlayAudio);
audioBufferPlay.onUpdate = function() { // Update UI for BufferPlayer
    if(document.getElementById("timePlayingAudio") != null) document.getElementById("timePlayingAudio").innerHTML = audioBufferPlay.currentTimeDisplay;
    if(document.getElementById("totalTimePlayingAudio") != null) document.getElementById("totalTimePlayingAudio").innerHTML = audioBufferPlay.maxTimeDisplay;

    if(audioBufferPlay.compatibilityMode) {
        if(document.getElementById("timeFinishedDownload") != null) document.getElementById("timeFinishedDownload").innerHTML = audioBufferPlay.remainingTimeDisplay;
        if(document.getElementById("progressProcessingSave") != null) document.getElementById("progressProcessingSave").style.width = audioBufferPlay.percent + "%";
    }
    
    if(document.getElementById("checkLoopPlay") != null) {
        if(document.getElementById("checkLoopPlay").checked) {
            audioBufferPlay.loop = true;
        } else {
            audioBufferPlay.loop = false;
        }
    }

    if(!audioBufferPlay.sliding && audioBufferPlay.sliderPlayAudio != undefined) {
        audioBufferPlay.sliderPlayAudio.setValue(audioBufferPlay.percent, false, false);
    }
    
    compaMode();
};

let compaModeStop = function() { return false; }; // Function called when the audio playing is stopped
let compaModeSaveStop = function() { return false; };

// Filter settings
// Bass boost settings
const bassBoostOptions = {
    frequencyBooster: 200, // Boost frequency equal or below
    dbBooster: 15,
    frequencyReduce: 200, // Reduce frequency equal or above
    dbReduce: -2
};
// End of bass boost settings
// High/low pass settings
const highLowPassOptions = {
    highFrequency: 3500,
    lowFrequency: 3500
};
// End of high/low pass settings
// Delay settings
const delayOptions = {
    delay: 0.20,
    gain: 0.75
};
// End of delay settings
// Impulses responses settings
const audioImpulseResponses = {
    current: 1,
    nbResponses: 13,
    loading: false,
    1: {
        title: "Medium Damping Cave E002 M2S",
        file: "assets/sounds/impulse_response.wav",
        size: 1350278,
        buffer: null,
        link: "http://www.cksde.com/p_6_250.htm",
        addDuration: 4,
        forceDownloadHigherQuality: true
    },
    2: {
        title: "The Dixon Studio Theatre – University of York",
        file: "assets/sounds/impulse_response_2.wav",
        size: 2304044,
        buffer: null,
        link: "https://openairlib.net/?page_id=452",
        addDuration: 3
    },
    3: {
        title: "Creswell Crags",
        file: "assets/sounds/impulse_response_3.wav",
        size: 1048220,
        buffer: null,
        link: "https://openairlib.net/?page_id=441",
        addDuration: 1
    },
    4: {
        title: "Jack Lyons Concert Hall – University of York",
        file: "assets/sounds/impulse_response_4.wav",
        size: 3072044,
        buffer: null,
        link: "https://openairlib.net/?page_id=571",
        addDuration: 4
    },
    5: {
        title: "Stairway – University of York",
        file: "assets/sounds/impulse_response_5.wav",
        size: 1728198,
        buffer: null,
        link: "https://openairlib.net/?page_id=678",
        addDuration: 3
    },
    6: {
        title: "1st Baptist Church Nashville",
        file: "assets/sounds/impulse_response_6.wav",
        size: 2050318,
        buffer: null,
        link: "https://openairlib.net/?page_id=406",
        addDuration: 4
    },
    7: {
        title: "R1 Nuclear Reactor Hall",
        file: "assets/sounds/impulse_response_7.wav",
        size: 5840914,
        buffer: null,
        link: "https://openairlib.net/?page_id=626",
        addDuration: 20
    },
    8: {
        title: "Maes Howe",
        file: "assets/sounds/impulse_response_8.wav",
        size: 288044,
        buffer: null,
        link: "https://openairlib.net/?page_id=602",
        addDuration: 1
    },
    9: {
        title: "Tyndall Bruce Monument",
        file: "assets/sounds/impulse_response_9.wav",
        size: 1382674,
        buffer: null,
        link: "https://openairlib.net/?page_id=764",
        addDuration: 5
    },
    10: {
        title: "Tvísöngur Sound Sculpture – Iceland",
        file: "assets/sounds/impulse_response_10.wav",
        size: 621026,
        buffer: null,
        link: "https://openairlib.net/?page_id=752",
        addDuration: 3
    },
    11: {
        title: "Usina del Arte Symphony Hall",
        file: "assets/sounds/impulse_response_11.wav",
        size: 454714,
        buffer: null,
        link: "https://openairlib.net/?page_id=770",
        addDuration: 5
    },
    12: {
        title: "Hoffmann Lime Kiln – Langcliffe, UK",
        file: "assets/sounds/impulse_response_12.wav",
        size: 1536044,
        buffer: null,
        link: "https://openairlib.net/?page_id=518",
        addDuration: 2
    },
    13: {
        title: "Innocent Railway Tunnel (middle)",
        file: "assets/sounds/impulse_response_13.wav",
        size: 5760056,
        buffer: null,
        link: "https://openairlib.net/?page_id=525",
        addDuration: 5
    }
};
// End of Impulses responses settings
// End of the filter settings

// Check if an audio type is supported
function checkAudio(type) {
    if(!window.HTMLAudioElement) {
        return false;
    }

    const audio = document.createElement("audio");

    if(!audio.canPlayType(type)) {
        return "no mp3 support";
    }

    return true;
}

// Audio buffer loader
// Load the file specified (audio parameter) into an audio buffer
// When loading is done, a callback is returned with the buffer and state (true if loading was done successfully, false otherwise)
function loadAudioBuffer(audio, func) {
    if('AudioContext' in window && !audioContextNotSupported) {
        const request = new XMLHttpRequest();
        request.open('GET', audio, true);
        request.responseType = 'arraybuffer';

        request.onload = () => {
            context.decodeAudioData(request.response, data => {
                if(typeof func !== 'undefined') {
                    func(data, true);
                }
            }, () => {
                func(null, false);
            });
        }

        request.onerror = () => {
            if(typeof func !== 'undefined') {
                func(null, false);
            }
        }

        request.send();
    } else {
        if(typeof(window.console.error) !== 'undefined') console.error(i18next.t("script.webAudioNotSupported"));

        if(typeof func !== 'undefined') {
            func(null, false);
        } else {
            return false;
        }
    }
}

// Check the audio buffer loaded (two type : "audio_impulse_response" (buffers used for the reverb filter) and "audio_modulator" (buffer used for the vocoder filter))
function checkAudioBuffer(bufferName, type) {
    const errorText = i18next.t("loading.errorLoadingTooltip");

    if ('AudioContext' in window && !audioContextNotSupported) {
        switch(type) {
            case "audio_impulse_response":
                if(bufferName == null) {
                    setTooltip("checkReverb", errorText, true, false, "checkReverbWrapper", true);
                    document.getElementById("checkReverb").checked = false;
                    document.getElementById("checkReverbGroup").setAttribute("class", "checkbox disabled");
                } else {
                    setTooltip("checkReverb", "", false, true, "checkReverbWrapper", true);
                    document.getElementById("checkReverbGroup").setAttribute("class", "checkbox");
                }
            break;
            case "audio_modulator":
                if(bufferName == null || (typeof(window.OfflineAudioContext) === "undefined" && typeof(window.webkitOfflineAudioContext) === "undefined")) {
                    setTooltip("checkVocode", errorText, true, false, "checkVocodeWrapper", true);
                    document.getElementById("checkVocode").checked = false;
                    document.getElementById("checkVocodeGroup").setAttribute("class", "checkbox disabled");
                } else {
                    setTooltip("checkVocode", "", false, true, "checkVocodeWrapper", true);
                    document.getElementById("checkVocodeGroup").setAttribute("class", "checkbox");
                }
            break;
        }
    }
}

// Convert bytes to KB/MB or GB
function autoConvertByte(size) {
    if(size >= 1000000000) {
        return (size / 1000000000).toFixed(2).replace(".", ",") + " " + i18next.t("reverbSettings.unit.gigabyte");
    } else if(size >= 1000000) {
        return (size / 1000000).toFixed(2).replace(".", ",") + " " + i18next.t("reverbSettings.unit.megabyte");
    } else if(size >= 1000) {
        return (size / 1000).toFixed(2).replace(".", ",") + " " + i18next.t("reverbSettings.unit.kilobyte");
    } else {
        return size + " " + i18next.t("reverbSettings.unit.byte");
    }
}
// End of Audio buffer loader

// File loading functions
// Function called when the "Select an audio file" button is pressed
function selectFile() {
    document.getElementById("inputFile").click();
}

// Function called when a file is selected
// Load the file and store it in the audioBuffers.principal variable
document.getElementById("inputFile").addEventListener("change", function() {
    const reader = new FileReader();

    reader.onload = ev => {
        context.resume();

        context.decodeAudioData(ev.target.result, buffer => {
            loadPrincipalBuffer(buffer);
        }, () => { // Error
            document.getElementById("errorLoadingSelectFile").style.display = "block";
            document.getElementById("firstEtape").style.display = "block";
            document.getElementById("secondEtape").style.display = "none";
        });
    };

    if(this.files && this.files[0]) {
        document.getElementById("errorLoadingSelectFile").style.display = "none";
        document.getElementById("firstEtape").style.display = "none";
        document.getElementById("secondEtape").style.display = "block";
    
        reader.readAsArrayBuffer(this.files[0]); // Read the file
    }
}, false);

// Load an audio buffer and store it in the audioBuffers.principal variable
// Launch the edit UI
function loadPrincipalBuffer(buffer) {
    if(buffer.numberOfChannels == 1) { // convert to stereo buffer
        context.resume();
        audioBuffers.principal = context.createBuffer(2, context.sampleRate * buffer.duration + context.sampleRate * 2, context.sampleRate);

        for(let channel = 0; channel < audioBuffers.principal.numberOfChannels; channel++) {
            const nowBuffering = audioBuffers.principal.getChannelData(channel);

            for(let i = 0; i < buffer.length; i++) {
                nowBuffering[i] = buffer.getChannelData(0)[i];
            }
        }
    } else {
        audioBuffers.principal = buffer;
    }

    document.getElementById("firstEtapeBis").style.display = "none";
    document.getElementById("secondEtape").style.display = "none";
    document.getElementById("thirdEtape").style.display = "block";
    document.getElementById("lastEtape").style.display = "block";

    validModify(false, false);
}
// End of File loading functions

// Filters
// Phone filter
function getTelephonizer(context) {
    const lpf1 = context.createBiquadFilter();
    lpf1.type = "lowpass";
    lpf1.frequency.value = 2000.0;
    const lpf2 = context.createBiquadFilter();
    lpf2.type = "lowpass";
    lpf2.frequency.value = 2000.0;
    const hpf1 = context.createBiquadFilter();
    hpf1.type = "highpass";
    hpf1.frequency.value = 500.0;
    const hpf2 = context.createBiquadFilter();
    hpf2.type = "highpass";
    hpf2.frequency.value = 500.0;
    lpf1.connect(lpf2);
    lpf2.connect(hpf1);
    hpf1.connect(hpf2);

    return {
        "input": lpf1,
        "output": hpf2
    };
}

// Delay filter
function getDelay(context, delay, gain) {
    const delayNode = context.createDelay(179);
    delayNode.delayTime.value = delay;

    const gainNode = context.createGain();
    gainNode.gain.value = gain;

    gainNode.connect(delayNode);
    delayNode.connect(gainNode);

    return {
        "input": gainNode,
        "output": delayNode
    };
}

// Bitcrusher (8-bit effect) filter
function getBitCrusher(context, bits, normFreq, bufferSize, channels) {
    const bitCrusher = context.createScriptProcessor(bufferSize, channels, channels);
    let phaser = 0;
    let last = 0;
    normFreq /= (context.sampleRate / 48000);

    bitCrusher.onaudioprocess = e => {
        const step = 2 * Math.pow(1 / 2, bits);

        for(let channel = 0; channel < e.inputBuffer.numberOfChannels; channel++) {
            const input = e.inputBuffer.getChannelData(channel);
            const output = e.outputBuffer.getChannelData(channel);

            for(let i = 0; i < bufferSize; i++) {
                phaser += normFreq;

                if(phaser >= 1.0) {
                    phaser -= 1.0;
                    last = step * Math.floor((input[i] * (1 / step)) + 0.5);
                }

                output[i] = last;
            }
        }
    };

    return bitCrusher;
}

// Reverse the audio filter
function returnBuffer(buffer) {
    context.resume();

    const bufferReturned = context.createBuffer(2, context.sampleRate * buffer.duration + context.sampleRate * 2, context.sampleRate);

    for(let channel = 0; channel < buffer.numberOfChannels; channel++) {
        const nowBuffering = bufferReturned.getChannelData(channel);
        
        for(let i = 0; i < bufferReturned.length; i++) {
            nowBuffering[i] = buffer.getChannelData(channel)[buffer.length - 1 - i];
        }

        bufferReturned.getChannelData(channel).set(nowBuffering);
    }

    return bufferReturned;
}

// Passall filter (script processor)
// Pass all audio without any modification
function passAll(audioProcessingEvent) {
    const inputBuffer = audioProcessingEvent.inputBuffer;
    const outputBuffer = audioProcessingEvent.outputBuffer;

    for(let channel = 0; channel < outputBuffer.numberOfChannels; channel++) {
        const inp = inputBuffer.getChannelData(channel);
        const out = outputBuffer.getChannelData(channel);

        for(let sample = 0; sample < inputBuffer.length; sample++) {
            out[sample] = inp[sample];
        }
    }
}
// End of filters

// Filter settings functions
// Limiter settings
function loadLimiterValues() {
    document.getElementById("preGain").value = limiter.preGain;
    document.getElementById("postGain").value = limiter.postGain;
    document.getElementById("attackTime").value = limiter.attackTime;
    document.getElementById("releaseTime").value = limiter.releaseTime;
    document.getElementById("threshold").value = limiter.threshold;
    document.getElementById("lookAheadTime").value = limiter.lookAheadTime;
}

function setLimiterValues() {
    const preGain = document.getElementById("preGain").value;
    const postGain = document.getElementById("postGain").value;
    const attackTime = document.getElementById("attackTime").value;
    const releaseTime = document.getElementById("releaseTime").value;
    const threshold = document.getElementById("threshold").value;
    const lookAheadTime = document.getElementById("lookAheadTime").value;

    if(preGain != null && preGain.trim() != "" && !isNaN(preGain)) limiter.preGain = preGain;
    if(postGain != null && postGain.trim() != "" && !isNaN(postGain)) limiter.postGain = postGain;
    if(attackTime != null && attackTime.trim() != "" && !isNaN(attackTime) && attackTime >= 0) limiter.attackTime = attackTime;
    if(releaseTime != null && releaseTime.trim() != "" && !isNaN(releaseTime) && releaseTime >= 0) limiter.releaseTime = releaseTime;
    if(threshold != null && threshold.trim() != "" && !isNaN(threshold)) limiter.threshold = threshold;
    if(lookAheadTime != null && lookAheadTime.trim() != "" && !isNaN(lookAheadTime) && lookAheadTime >= 0) limiter.lookAheadTime = lookAheadTime;

    loadLimiterValues();
}

function resetLimiterValues() {
    limiter.preGain = 0;
    limiter.postGain = 0;
    limiter.attackTime = 0;
    limiter.releaseTime = 3;
    limiter.threshold = -0.05;
    limiter.lookAheadTime = 0.05;

    loadLimiterValues();
}
// End of limiter settings

// Soundtouch settings
slider.on("slide", value => {
    st.pitch = value;
    pitchAudio = value;
    calcBufferPlayerTime();
});

slider.on("slideStart", value => {
    st.pitch = value;
    pitchAudio = value;
    calcBufferPlayerTime();
});

slider.on("slideStop", value => {
    st.pitch = value;
    pitchAudio = value;
    calcBufferPlayerTime();
});

slider2.on("slide", value => {
    st.tempo = value;
    speedAudio = value;
    calcBufferPlayerTime();
});

slider2.on("slideStart", value => {
    st.tempo = value;
    speedAudio = value;
    calcBufferPlayerTime();
});

slider2.on("slideStop", value => {
    st.tempo = value;
    speedAudio = value;
    calcBufferPlayerTime();
});
// End of Soundtouch settings

// Bass boost options
function loadBassBoostValues() {
    document.getElementById("frequencyBooster").value = bassBoostOptions.frequencyBooster;
    document.getElementById("dbBooster").value = bassBoostOptions.dbBooster;
    document.getElementById("frequencyReduce").value = bassBoostOptions.frequencyReduce;
    document.getElementById("dbReduce").value = bassBoostOptions.dbReduce;
}

function setBassBoostFilter() {
    if(bassBoostFilter != null) {
        bassBoostFilter.frequency.value = bassBoostOptions.frequencyBooster;
        bassBoostFilter.gain.value = bassBoostOptions.dbBooster;
    }

    if(bassBoostFilterHighFreq != null) {
        bassBoostFilterHighFreq.frequency.value = bassBoostOptions.frequencyReduce;
        bassBoostFilterHighFreq.gain.value = bassBoostOptions.dbReduce;
    }

    loadBassBoostValues();
}

function validateBassBoostValues() {
    const frequencyBooster = document.getElementById("frequencyBooster").value;
    const dbBooster = document.getElementById("dbBooster").value;
    const frequencyReduce = document.getElementById("frequencyReduce").value;
    const dbReduce = document.getElementById("dbReduce").value;

    if(frequencyBooster != null && frequencyBooster.trim() != "" && !isNaN(frequencyBooster) && frequencyBooster >= 0) bassBoostOptions.frequencyBooster = frequencyBooster;
    if(dbBooster != null && dbBooster.trim() != "" && !isNaN(dbBooster)) bassBoostOptions.dbBooster = dbBooster;
    if(frequencyReduce != null && frequencyReduce.trim() != "" && !isNaN(frequencyReduce) && frequencyReduce >= 0) bassBoostOptions.frequencyReduce = frequencyReduce;
    if(dbReduce != null && dbReduce.trim() != "" && !isNaN(dbReduce)) bassBoostOptions.dbReduce = dbReduce;

    setBassBoostFilter();
}

function resetBassBoostValues() {
    bassBoostOptions.frequencyBooster = 200;
    bassBoostOptions.dbBooster = 15;
    bassBoostOptions.frequencyReduce = 200;
    bassBoostOptions.dbReduce = -2;

    setBassBoostFilter();
}
// End of Bass boost options

// Low and high pass filters options
function loadHighPassValues() {
    document.getElementById("frequencyHighPass").value = highLowPassOptions.highFrequency;
}

function setHighPassFilter() {
    if(highPassFilter != null) {
        highPassFilter.frequency.value = highLowPassOptions.highFrequency;
    }

    loadHighPassValues();
}

function validateHighPassValues() {
    const frequencyHighPass = document.getElementById("frequencyHighPass").value;

    if(frequencyHighPass != null && frequencyHighPass.trim() != "" && !isNaN(frequencyHighPass) && frequencyHighPass >= 0) highLowPassOptions.highFrequency = frequencyHighPass;

    setHighPassFilter();
}

function resetHighPassValues() {
    highLowPassOptions.highFrequency = 3500;
    setHighPassFilter();
}

function loadLowPassValues() {
    document.getElementById("frequencyLowPass").value = highLowPassOptions.lowFrequency;
}

function setLowPassFilter() {
    if(lowPassFilter != null) {
        lowPassFilter.frequency.value = highLowPassOptions.lowFrequency;
    }

    loadLowPassValues();
}

function validateLowPassValues() {
    const frequencyLowPass = document.getElementById("frequencyLowPass").value;

    if(frequencyLowPass != null && frequencyLowPass.trim() != "" && !isNaN(frequencyLowPass) && frequencyLowPass >= 0) highLowPassOptions.lowFrequency = frequencyLowPass;

    setLowPassFilter();
}

function resetLowPassValues() {
    highLowPassOptions.lowFrequency = 3500;
    setLowPassFilter();
}
// End of low and high pass filters options

// Delay options
function loadDelayValues() {
    document.getElementById("delaySeconds").value = delayOptions.delay;
    document.getElementById("delayGain").value = delayOptions.gain;
}

function setDelayFilter() {
    if(delayFilter != null) {
        if(delayFilter["input"] != null) {
            delayFilter["input"].gain.value = delayOptions.gain;
        }

        if(delayFilter["output"] != null) {
            delayFilter["output"].delayTime.value = delayOptions.delay;
        }
    }

    loadDelayValues();
}

function validateDelayValues() {
    const delaySeconds = document.getElementById("delaySeconds").value;
    const delayGain = document.getElementById("delayGain").value;

    if(delaySeconds != null && delaySeconds.trim() != "" && !isNaN(delaySeconds) && delaySeconds >= 0 && delaySeconds <= 179) delayOptions.delay = delaySeconds;
    if(delayGain != null && delayGain.trim() != "" && !isNaN(delayGain)) delayOptions.gain = delayGain;

    setDelayFilter();
}

function resetDelayValues() {
    delayOptions.delay = 0.20;
    delayOptions.gain = 0.75;
    setDelayFilter();
}
// End of delay options

// Reverb options
function reverbStateSettings() {
    if(!audioImpulseResponses.loading) {
        document.getElementById("loadingReverb").style.display = "none";
        document.getElementById("environmentReverb").classList.remove("disabled");
        document.getElementById("environmentReverb").disabled = false;
        document.getElementById("validReverbSettings").classList.remove("disabled");
        document.getElementById("validReverbSettings").disabled = false;
        document.getElementById("resetReverbSettings").classList.remove("disabled");
        document.getElementById("resetReverbSettings").disabled = false;
    } else {
        document.getElementById("loadingReverb").style.display = "block";
        document.getElementById("environmentReverb").classList.add("disabled");
        document.getElementById("environmentReverb").disabled = true;
        document.getElementById("validReverbSettings").classList.add("disabled");
        document.getElementById("validReverbSettings").disabled = true;
        document.getElementById("resetReverbSettings").classList.add("disabled");
        document.getElementById("resetReverbSettings").disabled = true;
    }
}

function loadReverbValues() {
    const nb = audioImpulseResponses.nbResponses;
    const current = audioImpulseResponses.current;
    document.getElementById("environmentReverb").innerHTML = "";

    for(let i = 1; i <= nb; i++) {
        const option = document.createElement("option");
        option.text = audioImpulseResponses[i].title;
        option.value = i;
        document.getElementById("environmentReverb").add(option);
    }

    document.getElementById("environmentReverb").value = current;

    loadInfosCurrentEnvironment();
    reverbStateSettings();
}

function loadInfosCurrentEnvironment() {
    document.getElementById("linkEnvironmentReverb").href = audioImpulseResponses[document.getElementById("environmentReverb").value].link;
    document.getElementById("environmentSize").innerHTML = autoConvertByte(audioImpulseResponses[document.getElementById("environmentReverb").value].size);

    if(audioImpulseResponses[document.getElementById("environmentReverb").value].buffer != null) {
        document.getElementById("environmentAlreadyDownloaded").style.display = "block";
    } else {
        document.getElementById("environmentAlreadyDownloaded").style.display = "none";
    }

    if(audioImpulseResponses[document.getElementById("environmentReverb").value].buffer != null && audioImpulseResponses[document.getElementById("environmentReverb").value].forceDownloadHigherQuality) {
        document.getElementById("environmentAlreadyDownloadedLowQuality").style.display = "block";
    } else {
        document.getElementById("environmentAlreadyDownloadedLowQuality").style.display = "none";
    }
}

document.getElementById("environmentReverb").onchange = loadInfosCurrentEnvironment;

function setReverbFilter() {
    const buffer = audioImpulseResponses[audioImpulseResponses.current].buffer;

    if(convolver != null && buffer != null) {
        convolver.buffer = buffer;
        calcBufferPlayerTime();
    }

    checkAudioBuffer(buffer, "audio_impulse_response");
    loadReverbValues();
}

function validateReverbValues() {
    if(!audioImpulseResponses.loading) {
        const value = document.getElementById("environmentReverb").value;
    
        if(value != null && value.trim() != "" && !isNaN(value) && value >= 1 && value <= audioImpulseResponses.nbResponses) {
            if(audioImpulseResponses[value].buffer == null || audioImpulseResponses[value].forceDownloadHigherQuality) {
                document.getElementById("errorLoadingReverb").style.display = "none";
                audioImpulseResponses.loading = true;
                reverbStateSettings();

                loadAudioBuffer(audioImpulseResponses[value].file, (data, success) => {
                    audioImpulseResponses.loading = false;
        
                    if(success) {
                        audioImpulseResponses[value].buffer = data;
                        audioImpulseResponses.current = value;
                        audioImpulseResponses[value].forceDownloadHigherQuality = false;
                    } else {
                        document.getElementById("errorLoadingReverb").style.display = "block";
                    }
        
                    setReverbFilter();
                });
            } else {
                document.getElementById("loadingReverb").style.display = "none";
                document.getElementById("errorLoadingReverb").style.display = "none";
                audioImpulseResponses.loading = false;
                audioImpulseResponses.current = value;
                setReverbFilter();
            }
        }
    }
}

function resetReverbValues() {
    if(!audioImpulseResponses.loading && audioImpulseResponses[1].buffer != null) {
        audioImpulseResponses.current = 1;
    }

    setReverbFilter();
}
// End of delay options
// End of filter settings functions

// Real time functions
// Nodes
let limiterProcessor = null;
let bitCrusher = null;
let lowPassFilter = null;
let highPassFilter = null;
let bassBoostFilter = null;
let bassBoostFilterHighFreq = null;
let telephonizer = null;
let delayFilter = null;
let convolver = null;
let gainNode = null;
// End of the nodes

// Calculate the audio duration and change the audio duration of the player in compatibility mode
function calcBufferPlayerTime() {
    if(compaAudioAPI) {
        audioBufferPlay.duration = calcAudioDuration(audioBuffers.principal, null, pitchAudio, reverbAudio, vocoderAudio, echoAudio);
        audioBufferPlay.speedAudio = speedAudio;
    }
}

// Return the current context according to the current mode (compatibility mode or standard mode)
function getCurrentContext(durationAudio, comp) {
    if(!comp && typeof(window.OfflineAudioContext) !== "undefined") {
        return new OfflineAudioContext(2, context.sampleRate * durationAudio, context.sampleRate);
    } else if(!comp && typeof(window.webkitOfflineAudioContext) !== "undefined") {
        return new webkitOfflineAudioContext(2, context.sampleRate * durationAudio, context.sampleRate);
    } else {
        return context;
    }
}

// Reset the Soundtouch filter
function resetFilter(sourceSound, pipe) {
    soundtouchFilter._pipe = pipe;
    soundtouchFilter.sourceSound = sourceSound;
    soundtouchFilter.historyBufferSize = 22050;
    soundtouchFilter._sourcePosition = 0;
    soundtouchFilter.outputBufferPosition = 0;
    soundtouchFilter._position = 0;
}

// Connect the Audio API nodes according to the settings
function connectNodes(offlineContext, speed, pitch, reverb, comp, lowpass, highpass, bassboost, phone, returnAudioParam, echo, bitCrush, enableLimiter, rate, BUFFER_SIZE) {
    // Default parameters
    speed = speed || 1; // Speed of the audio
    pitch = pitch || 1; // Pitch of the audio
    reverb = reverb == undefined ? false : reverb; // Enable or disable reverb
    comp = comp == undefined ? false : comp; // Enable or disable the compatibility mode
    lowpass = lowpass == undefined ? false : lowpass; // Enable lowPass filter
    highpass = highpass == undefined ? false : highpass; // Enable highPass filter
    bassboost = bassboost == undefined ? false : bassboost; // Enable Bass Boost
    phone = phone == undefined ? false : phone; // Enable Phone Call
    returnAudioParam = returnAudioParam == undefined ? false : returnAudioParam; // Enable Audio Return
    enableLimiter = enableLimiter == undefined ? false : enableLimiter; // Enable Limiter
    echo = echo == undefined ? false : echo; // Enable Echo
    bitCrush = bitCrush == undefined ? false : bitCrush; // Enable BitCrusher
    rate = rate || 1; // Rate of the audio
    BUFFER_SIZE = BUFFER_SIZE || 4096; // Buffer size of the audio
    // End of default parameters

    if('AudioContext' in window && !audioContextNotSupported && offlineContext != null) {
        let previousSountouchNode = soundtouchNode;
        const buffer = audioBuffers.processed;

        if(comp) {
            calcBufferPlayerTime();
        }

        // Soundtouch settings
        st.pitch = pitch;
        st.tempo = speed;
        st.rate = rate;
        soundtouchNode = soundtouch.getWebAudioNode(offlineContext, soundtouchFilter);
        soundtouchFilter.callback = () => soundtouchNode.disconnect();
        let node = soundtouchNode;
        // End of Soundtouch settings

        // Disconnect all previous nodes
        if(limiterProcessor != null) limiterProcessor.onaudioprocess = null;
        if(previousSountouchNode != null) previousSountouchNode.disconnect();
        if(gainNode != null) gainNode.disconnect();
        if(bitCrusher != null) bitCrusher.disconnect();
        if(lowPassFilter != null) lowPassFilter.disconnect();
        if(highPassFilter != null) highPassFilter.disconnect();
        if(bassBoostFilter != null) bassBoostFilter.disconnect();
        if(bassBoostFilterHighFreq != null) bassBoostFilterHighFreq.disconnect();
        if(delayFilter != null && delayFilter["output"] != null) delayFilter["output"].disconnect();
        if(telephonizer != null && telephonizer["output"] != null) telephonizer["output"].disconnect();
        if(convolver != null) convolver.disconnect();
        // End of Disconnecte all previous nodes

        // Gain node
        node.connect(gainNode);
        node = gainNode;

        if(enableLimiter) {
            limiter.reset();
            limiterProcessor.onaudioprocess = e => {
                if(limiter && limiter.limit) {
                    const limit = limiter.limit.bind(limiter);
                    limit(e);
                }
            };
        } else {
            limiterProcessor.onaudioprocess = passAll;
        }

        if(bitCrush) {
            bitCrusher = getBitCrusher(offlineContext, 8.0, 0.15, BUFFER_SIZE, buffer.numberOfChannels);
            node.connect(bitCrusher);
            node = bitCrusher;
        }

        if(lowpass) {
            lowPassFilter = offlineContext.createBiquadFilter();
            lowPassFilter.type = "lowpass";
            lowPassFilter.frequency.value = highLowPassOptions.lowFrequency;
        }

        if(highpass) {
            highPassFilter = offlineContext.createBiquadFilter();
            highPassFilter.type = "highpass";
            highPassFilter.frequency.value = highLowPassOptions.highFrequency;
        }

        if(bassboost) {
            bassBoostFilter = offlineContext.createBiquadFilter();
            bassBoostFilter.type = "lowshelf";
            bassBoostFilter.frequency.value = bassBoostOptions.frequencyBooster;
            bassBoostFilter.gain.value = bassBoostOptions.dbBooster;
            bassBoostFilterHighFreq = offlineContext.createBiquadFilter();
            bassBoostFilterHighFreq.type = "highshelf";
            bassBoostFilterHighFreq.frequency.value = bassBoostOptions.frequencyReduce;
            bassBoostFilterHighFreq.gain.value = bassBoostOptions.dbReduce;
            bassBoostFilterHighFreq.connect(bassBoostFilter);
        }

        if(phone) {
            telephonizer = getTelephonizer(offlineContext);
        }

        let output = limiterProcessor;

        if(echo) {
            delayFilter = getDelay(offlineContext, delayOptions.delay, delayOptions.gain);
            delayFilter["output"].connect(output);
            output = delayFilter["input"];
        }

        const reverb_buffer = audioImpulseResponses[audioImpulseResponses.current].buffer;

        if(reverb && reverb_buffer != null) {
            convolver = offlineContext.createConvolver();
            convolver.buffer = reverb_buffer;
            convolver.connect(output);
            output = convolver;
        }

        if(phone) {
            telephonizer["output"].connect(output);
            output = telephonizer["input"];
        }

        if(lowpass && highpass) {
            node.connect(lowPassFilter);
            lowPassFilter.connect(highPassFilter);

            if(bassboost) {
                highPassFilter.connect(bassBoostFilterHighFreq);
                bassBoostFilter.connect(output);
            } else {
                highPassFilter.connect(output);
            }
        } else if(lowpass) {
            node.connect(lowPassFilter);

            if(bassboost) {
                lowPassFilter.connect(bassBoostFilterHighFreq);
                bassBoostFilter.connect(output);
            } else {
                lowPassFilter.connect(output);
            }
        } else if(highpass) {
            node.connect(highPassFilter);

            if(bassboost) {
                highPassFilter.connect(bassBoostFilterHighFreq);
                bassBoostFilter.connect(output);
            } else {
                highPassFilter.connect(output);
            }
        } else {
            if(bassboost) {
                node.connect(bassBoostFilterHighFreq);
                bassBoostFilter.connect(output);
            } else {
                node.connect(output);
            }
        }
    }
}

// Launch the connection of the Audio API nodes
function validConnectNodes(BUFFER_SIZE) {
    BUFFER_SIZE = BUFFER_SIZE || 4096; // Buffer size of the audio
    connectNodes(processing_context, speedAudio, pitchAudio, reverbAudio, compaAudioAPI, lowpassAudio, highpassAudio, bassboostAudio, phoneAudio, returnAudio, echoAudio, bitCrusherAudio, limiterAudio, 1, BUFFER_SIZE);
}

// Functions called when a setting is changed
// Call the validConnectNodes function
document.getElementById("checkReverb").onchange = function() {
    validSettings();
    validConnectNodes();
};

document.getElementById("checkLowpass").onchange = function() {
    validSettings();
    validConnectNodes();
};

document.getElementById("checkHighpass").onchange = function() {
    validSettings();
    validConnectNodes();
};

document.getElementById("checkBassBoost").onchange = function() {
    validSettings();
    validConnectNodes();
};

document.getElementById("checkPhone").onchange = function() {
    validSettings();
    validConnectNodes();
};

document.getElementById("checkLimiter").onchange = function() {
    validSettings();
    validConnectNodes();
};

document.getElementById("checkEcho").onchange = function() {
    validSettings();
    validConnectNodes();
};

document.getElementById("checkBitCrusher").onchange = function() {
    validSettings();
    validConnectNodes();
};
// End of functions called when a setting is changed
// End of real time functions

// Audio rendering and saving functions
// Add a to b
function add(a, b) {
    return a + b;
}

// Calculate audio duration according to selected settings
function calcAudioDuration(audio, speed, pitch, reverb, vocode, echo) {
    if(audio) {
        let duration = audio.duration + 1;
        const reverb_duration = audioImpulseResponses[audioImpulseResponses.current].addDuration;
    
        if(speed) duration = duration / parseFloat(speed);
    
        if(echo && reverb) {
            const addDuration = Math.max(5, reverb_duration);
            duration = duration + addDuration;
        } else if(echo) {
            duration = duration + 5;
        } else if(reverb) {
            duration = duration + reverb_duration;
        }
    
        return duration;
    }

    return 0;
}

// Render the audio according to the settings
// Core function of the app
// Use the connectNodes function to do the effective Audio API nodes connection
function renderAudioAPI(audio, speed, pitch, reverb, save, play, audioName, comp, vocode, lowpass, highpass, bassboost, phone, returnAudioParam, echo, bitCrush, enableLimiter, rate, BUFFER_SIZE) {
    // Default parameters
    save = save == undefined ? false : save; // Save the audio buffer under a wav file
    play = play == undefined ? false : play; // Play the audio
    audioName = audioName || "sample"; // The audio buffer variable name (global)
    comp = comp == undefined ? false : comp; // Enable or disable the compatibility mode
    // End of default parameters

    if('AudioContext' in window && !audioContextNotSupported && !audioProcessing) {
        const durationAudio = calcAudioDuration(audio, speed, pitch, reverb, vocode, echo);

        const offlineContext = getCurrentContext(durationAudio, comp);
        processing_context = offlineContext;

        if(typeof(window.OfflineAudioContext) === "undefined" && typeof(window.webkitOfflineAudioContext) === "undefined") {
            enableCompaMode();
            comp = true;
        }

        if(typeof(audioBuffers.modulator) == "undefined" || audioBuffers.modulator == null) vocode = false;

        document.getElementById("processingModifLoader").style.display = "block";
        document.getElementById("validInputModify").disabled = true;
        document.getElementById("saveInputModify").disabled = true;
        document.getElementById("resetAudio").disabled = true;
        audioProcessing = true;

        function renderAudio(buffer) {
            audioBuffers.processed = buffer;

            st.clear();
            resetFilter(new soundtouch.WebAudioBufferSource(audioBuffers.processed), st);

            if(limiterProcessor != null) {
                limiterProcessor.onaudioprocess = null;
                limiterProcessor.disconnect();
            }

            limiterProcessor = offlineContext.createScriptProcessor(BUFFER_SIZE, audioBuffers.processed.numberOfChannels, audioBuffers.processed.numberOfChannels);
            
            gainNode = offlineContext.createGain();
            gainNode.gain.setValueAtTime(0.001, offlineContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(1.0, offlineContext.currentTime + 0.2);

            validConnectNodes(BUFFER_SIZE);

            if(!comp) { // Standard mode
                limiterProcessor.connect(offlineContext.destination);

                offlineContext.oncomplete = e => {
                    window[audioName] = e.renderedBuffer;
                    audioBufferPlay.setOnPlayingFinished(null);
                    audioBufferPlay.speedAudio = speedAudio;
                    audioBufferPlay.loadBuffer(window[audioName]);

                    document.getElementById("validInputModify").disabled = false;
                    document.getElementById("resetAudio").disabled = false;
                    document.getElementById("processingModifLoader").style.display = "none";
                    audioProcessing = false;
                    compaMode();

                    if(!compatModeChecked) {
                        const sum = e.renderedBuffer.getChannelData(0).reduce(add, 0);

                        if(sum == 0) {
                            enableCompaMode();
                        }

                        compatModeChecked = true;
                    }

                    if(play) {
                        launchPlay();
                    }

                    if(save) {
                        saveBuffer(e.renderedBuffer);
                    }
                };

                offlineContext.startRendering();
            } else { // Compatibility mode
                if(!save) {
                    document.getElementById("validInputModify").disabled = false;
                    document.getElementById("resetAudio").disabled = false;
                    document.getElementById("processingModifLoader").style.display = "none";
                    audioProcessing = false;
                    compaMode();
                } else {
                    document.getElementById("processingModifLoader").style.display = "none";
                    document.getElementById("processingSave").style.display = "block";
                    document.getElementById("playAudio").disabled = true;
                    document.getElementById("stopAudio").disabled = true;
                }

                if(play) {
                    audioBufferPlay.speedAudio = speedAudio;
                    audioBufferPlay.setCompatibilityMode(Math.round(durationAudio));
                    limiterProcessor.connect(offlineContext.destination);
                    audioBufferPlay.start();

                    compaModeStop = stopSave => {
                        try {
                            limiterProcessor.disconnect();
                            audioBufferPlay.stop();
                            if(stopSave) compaModeSaveStop();
                            return true;
                        } catch(e) {
                            return false;
                        }
                    };

                    function loopAudio() {
                        compaModeStop(true);

                        if(compaAudioAPI && play && document.getElementById("checkLoopPlay").checked) {
                            launchPlay();
                        }
                    }

                    audioBufferPlay.setOnPlayingFinished(() => {
                        loopAudio();
                    });

                    if(save) {
                        const rec = new Recorder(limiterProcessor, { workerPath: "src/recorderWorker.js" });
                        rec.record();

                        function onSaveFinished() {
                            compaModeStop(false);
                            audioBufferPlay.setOnPlayingFinished(null);
                            audioBufferPlay.stop();
                            document.getElementById("validInputModify").disabled = false;
                            document.getElementById("resetAudio").disabled = false;
                            document.getElementById("playAudio").disabled = false;
                            document.getElementById("stopAudio").disabled = false;
                            document.getElementById("processingSave").style.display = "none";
                            audioProcessing = false;
                            compaMode();
                        }

                        audioBufferPlay.setOnPlayingFinished(() => {
                            if(compaAudioAPI && save) {
                                rec.stop();
    
                                rec.exportWAV(blob => {
                                    downloadAudioBlob(blob);
                                    onSaveFinished();
                                });
                            }
                        });

                        compaModeSaveStop = () => {
                            try {
                                rec.stop();
                                onSaveFinished();
                                return true;
                            } catch(e) {
                                return false;
                            }
                        };
                    }
                }
            }
        }

        if(returnAudioParam && audioBuffers.returned == null) {
            audioBuffers.returned = returnBuffer(audio);
        }

        if(returnAudioParam) {
            audio = audioBuffers.returned;
        }

        // Vocoder filter
        if(vocode && audioBuffers.modulator != null && (typeof(window.OfflineAudioContext) !== "undefined" || typeof(window.webkitOfflineAudioContext) !== "undefined")) {
            let offlineContext2;

            if(typeof(window.OfflineAudioContext) !== "undefined") {
                offlineContext2 = new OfflineAudioContext(2, context.sampleRate * durationAudio, context.sampleRate);
            } else if(typeof(window.webkitOfflineAudioContext) !== "undefined") {
                offlineContext2 = new webkitOfflineAudioContext(2, context.sampleRate * durationAudio, context.sampleRate);
            }

            if((!returnAudioParam && audioBuffers.vocoded == null) || (returnAudioParam && audioBuffers.returnedVocoded == null)) {
                if(comp) {
                    document.getElementById("playAudio").disabled = true;
                    document.getElementById("stopAudio").disabled = true;
                }

                offlineContext2.oncomplete = e => {
                    if(returnAudioParam) {
                        audioBuffers.returnedVocoded = e.renderedBuffer;
                    } else {
                        audioBuffers.vocoded = e.renderedBuffer;
                    }

                    renderAudio(e.renderedBuffer);
    
                    if(comp) {
                        document.getElementById("playAudio").disabled = false;
                        document.getElementById("stopAudio").disabled = false;
                    }
                };
    
                vocoder(offlineContext2, audioBuffers.modulator, audio);
                offlineContext2.startRendering();
            } else {
                if(returnAudioParam) {
                    renderAudio(audioBuffers.returnedVocoded);
                } else {
                    renderAudio(audioBuffers.vocoded);
                }
            }
        } else {
            renderAudio(audio);
        }
    } else if(!audioProcessing) { // Error (Audio API not supported)
        if(typeof(window.console.error) !== 'undefined') console.error(i18next.t("script.webAudioNotSupported"));
        return false;
    }
}

// Save the audio buffer passed in parameter
function saveBuffer(buffer) {
    let worker;

    if(typeof(Worker) !== "undefined" && Worker != null) {
        try {
            worker = getRecorderWorker.default();
        } catch(e) {
            launchPause();
            alert(i18next.t("script.workersErrorLoading"));
        }
    } else {
        if(typeof(window.console.error) !== 'undefined') console.error(i18next.t("script.workersNotSupported"));
        return false;
    }

    if('AudioContext' in window && !audioContextNotSupported && worker) {
        worker.onmessage = e => {
            if(e.data.command == 'exportWAV') {
                downloadAudioBlob(e.data.data);
            }

            worker.terminate();
        };

        worker.postMessage({
            command: "init",
            config: {
                sampleRate: context.sampleRate,
                numChannels: 2
            }
        });

        worker.postMessage({
            command: "record",

            buffer: [
                buffer.getChannelData(0),
                buffer.getChannelData(1)
            ]
        });

        worker.postMessage({
            command: "exportWAV",
            type: "audio/wav"
        });
    } else {
        if(typeof(window.console.error) !== 'undefined') console.error(i18next.t("script.webAudioNotSupported"));
        return false;
    }
}

// Download an audio blob
function downloadAudioBlob(blob) {
    Recorder.forceDownload(blob, filesDownloadName + "-" + new Date().toISOString() + ".wav");
}
// End of Audio rendering and saving functions

// Voice Recorder UI functions
// Function called when the button "Record with the microphone" is pressed
function recordAudio() {
    document.getElementById("firstEtape").style.display = "none";
    document.getElementById("firstEtapeBis").style.display = "block";
    recorderVoice.init(); // Init the VoiceRecorder (ask the user to allow access to the microphone)
}

// Function called when the button "Start" is pressed
function recordPlay() {
    recorderVoice.record(); // Record
}

// Function called when the button "Pause" is pressed
function recordPause() {
    recorderVoice.pause(); // Pause the recording
}

// Function called when the button "Stop" is pressed
function recordStop() {
    recorderVoice.stop(); // Stop the recording and launch the edit interface
}

// Called when the checkbox "Audio feedback" is checked/unchecked
document.getElementById("checkAudioRetour").onchange = function() {
    if(this.checked) {
        recorderVoice.audioFeedback(true); // Allow audio feedback
    } else {
        recorderVoice.audioFeedback(false); // Disallow audio feedback
    }
};
// Called when the checkbox "Noise suppression" is checked/unchecked
document.getElementById("checkAudioNoise").onchange = function() {
    if(this.checked) {
        recorderVoice.setNoiseSuppression(true); // Allow audio feedback
    } else {
        recorderVoice.setNoiseSuppression(false); // Disallow audio feedback
    }
};
// Called when the checkbox "Auto gain" is checked/unchecked
document.getElementById("checkAudioGain").onchange = function() {
    if(this.checked) {
        recorderVoice.setAutoGain(true); // Allow audio feedback
    } else {
        recorderVoice.setAutoGain(false); // Disallow audio feedback
    }
};
// Called when the checkbox "Echo cancellation" is checked/unchecked
document.getElementById("checkAudioEcho").onchange = function() {
    if(this.checked) {
        recorderVoice.setEchoCancellation(true); // Allow audio feedback
    } else {
        recorderVoice.setEchoCancellation(false); // Disallow audio feedback
    }
};
// Called when the select "Audio input" is changed
document.getElementById("audioInput").onchange = function() {
    recorderVoice.changeInput(this.value, this.options[this.selectedIndex].dataset.groupId);
};
// End of Voice Recorder UI functions

// Edit UI functions
// Validate the settings entered
function validSettings() {
    let tmp_pitch;
    let tmp_speed;

    try {
        tmp_pitch = document.getElementById("pitchRange").value;
        tmp_speed = document.getElementById("speedRange").value;
    } catch(e) {
        launchPause();
        alert(i18next.t("script.errorOccured"));
        return false;
    }

    loadLimiterValues();
    loadBassBoostValues();
    loadHighPassValues();
    loadLowPassValues();
    loadDelayValues();
    loadReverbValues();

    if(isNaN(tmp_pitch) || tmp_pitch == "" || tmp_pitch <= 0 || tmp_pitch > 5) {
        launchPause();
        alert(i18next.t("script.invalidPitch"));
        document.getElementById("pitchRange").value = pitchAudio;
        document.getElementById("speedRange").value = speedAudio;
        return false;
    } else if(isNaN(tmp_speed) || tmp_speed == "" || tmp_speed <= 0 || tmp_speed > 5) {
        launchPause();
        alert(i18next.t("script.invalidSpeed"));
        document.getElementById("pitchRange").value = pitchAudio;
        document.getElementById("speedRange").value = speedAudio;
        return false;
    } else {
        pitchAudio = tmp_pitch;
        speedAudio = tmp_speed;
        if(document.getElementById("checkReverb").checked == true) reverbAudio = true; else reverbAudio = false;
        if(document.getElementById("checkVocode").checked == true) vocoderAudio = true; else vocoderAudio = false;
        if(document.getElementById("checkLowpass").checked == true) lowpassAudio = true; else lowpassAudio = false;
        if(document.getElementById("checkHighpass").checked == true) highpassAudio = true; else highpassAudio = false;
        if(document.getElementById("checkBassBoost").checked == true) bassboostAudio = true; else bassboostAudio = false;
        if(document.getElementById("checkPhone").checked == true) phoneAudio = true; else phoneAudio = false;
        if(document.getElementById("checkReturnAudio").checked == true) returnAudio = true; else returnAudio = false;
        if(document.getElementById("checkLimiter").checked == true) limiterAudio = true; else limiterAudio = false;
        if(document.getElementById("checkEcho").checked == true) echoAudio = true; else echoAudio = false;
        if(document.getElementById("checkBitCrusher").checked == true) bitCrusherAudio = true; else bitCrusherAudio = false;
    }

    return true;
}

// Validate the settings and launch the audio rendering
// Fails if another audio rendering is currently running
function validModify(play, save) {
    if(!audioProcessing) {
        // Default parameters
        const play = play || false;
        const save = save || false;
        // End of default parameters
    
        loadLimiterValues();
        loadBassBoostValues();
        loadHighPassValues();
        loadLowPassValues();
        loadDelayValues();
        loadReverbValues();
    
        if(validSettings()) {
            launchStop();
    
            if(document.getElementById("checkCompa").checked == true) compaAudioAPI = true; else compaAudioAPI = false;
            compaMode();
    
            if(compaAudioAPI) {
                if(!checkAudio("audio/mp3") || !play) {
                    document.getElementById("validInputModify").disabled = false;
                }
    
                if(play) {
                    launchPlay();
                }
            } else {
                renderAudioAPI(audioBuffers.principal, speedAudio, pitchAudio, reverbAudio, save, play, "audio_principal_processed", compaAudioAPI, vocoderAudio, lowpassAudio, highpassAudio, bassboostAudio, phoneAudio, returnAudio, echoAudio, bitCrusherAudio, limiterAudio);
            }
    
            return true;
        }
    }

    return false;
}

// Enable the compatibility mode
function enableCompaMode() {
    document.getElementById("checkCompa").checked = true;
    document.getElementById("compatAutoDetected").style.display = "block";
    compaAudioAPI = true;
    compaMode();
}

// Function called when the "Play" button is pressed
function launchPlay() {
    if(typeof(audio_principal_processed) !== "undefined" && audio_principal_processed != null && !compaAudioAPI) {
        audioBufferPlay.start();
        checkButtonPlayAudioBuffer();
    } else if(compaAudioAPI) {
        launchStop();
        renderAudioAPI(audioBuffers.principal, speedAudio, pitchAudio, reverbAudio, false, true, "audio_principal_processed", compaAudioAPI, vocoderAudio, lowpassAudio, highpassAudio, bassboostAudio, phoneAudio, returnAudio, echoAudio, bitCrusherAudio, limiterAudio);
    }
}

// Function called when the "Stop" button is pressed
function launchStop() {
    audioBufferPlay.reset();
    compaModeStop(true);
    checkButtonPlayAudioBuffer();
}

// Function called when the "Pause" button is pressed
function launchPause() {
    if(!compaAudioAPI) {
        audioBufferPlay.pause();
        checkButtonPlayAudioBuffer();
    } else {
        launchStop();
        audioBufferPlay.pause();
    }
}

// Function called when the "Save" button is pressed
function launchSave() {
    if(!audioProcessing && typeof(audio_principal_processed) !== "undefined" && audio_principal_processed != null && !compaAudioAPI) {
        saveBuffer(audio_principal_processed);
    } else if(compaAudioAPI) {
        launchStop();
        renderAudioAPI(audioBuffers.principal, speedAudio, pitchAudio, reverbAudio, true, true, "audio_principal_processed", compaAudioAPI, vocoderAudio, lowpassAudio, highpassAudio, bassboostAudio, phoneAudio, returnAudio, echoAudio, bitCrusherAudio, limiterAudio);
    }
}

// Function called when the "Choose another file or recording" button is pressed
function launchReset() {
    launchPause();
    recordPause();
    
    if(!audioProcessing && confirm(i18next.t("script.launchReset"))) {
        document.getElementById("firstEtape").style.display = "block";
        document.getElementById("secondEtape").style.display = "none";
        document.getElementById("thirdEtape").style.display = "none";
        document.getElementById("lastEtape").style.display = "none";
        document.getElementById("firstEtapeBis").style.display = "none";
        document.getElementById("inputFile").value = "";
        launchStop();
        resetBuffers();
        recorderVoice.reset();
    }
}

function resetBuffers() {
    audioBuffers.principal = null;
    audioBuffers.returned = null;
    audioBuffers.vocoded = null;
    audioBuffers.returnedVocoded = null;
    audioBuffers.processed = null;
}

// Function called when the "Reset" button is pressed
function resetModify() {
    document.getElementById("checkReverb").checked = false;
    document.getElementById("checkEcho").checked = false;
    document.getElementById("checkVocode").checked = false;
    document.getElementById("checkLowpass").checked = false;
    document.getElementById("checkHighpass").checked = false;
    document.getElementById("checkBassBoost").checked = false;
    document.getElementById("checkPhone").checked = false;
    document.getElementById("checkReturnAudio").checked = false;
    document.getElementById("checkBitCrusher").checked = false;
    document.getElementById("checkLimiter").checked = true;
    slider.setValue(1.0);
    slider2.setValue(1.0);

    validSettings();
    validConnectNodes();
}

// Return a random number between min (inclusive) and max (inclusive)
function randomRange(min, max) {
    return ((Math.random() * max) + min).toFixed(1);
}

// Return a random boolean
function randomBool() {
    return Math.round(Math.random()) == 0 ? false : true;
}

// Function called when "Random settings" button is pressed
function randomModify() {
    const checkReverb = document.getElementById("checkReverb");
    const checkEcho = document.getElementById("checkEcho");
    const checkVocode = document.getElementById("checkVocode");
    const checkLowpass = document.getElementById("checkLowpass");
    const checkHighpass = document.getElementById("checkHighpass");
    const checkBassBoost = document.getElementById("checkBassBoost");
    const checkPhone = document.getElementById("checkPhone");
    const checkReturnAudio = document.getElementById("checkReturnAudio");
    const checkBitCrusher = document.getElementById("checkBitCrusher");

    if(!checkReverb.disabled) {
        checkReverb.checked = randomBool();
    }

    if(!checkEcho.disabled) {
        checkEcho.checked = randomBool();
    }

    if(!checkVocode.disabled) {
        checkVocode.checked = randomBool();
    }

    if(!checkLowpass.disabled) {
        checkLowpass.checked = randomBool();
    }

    if(!checkHighpass.disabled) {
        checkHighpass.checked = randomBool();
    }

    if(!checkBassBoost.disabled) {
        checkBassBoost.checked = randomBool();
    }

    if(!checkPhone.disabled) {
        checkPhone.checked = randomBool();
    }

    if(!checkReturnAudio.disabled) {
        checkReturnAudio.checked = randomBool();
    }

    if(!checkBitCrusher.disabled) {
        checkBitCrusher.checked = randomBool();
    }

    slider.setValue(randomRange(0.1, 5.0));
    slider2.setValue(randomRange(0.1, 5.0));

    validSettings();
    validConnectNodes();
}
// End of Edit UI functions

// Others UI functions
// Reload all the data
// Called when the link "click here to try to reload the data" is clicked (displayed if an error during loading of the data occurred)
function reloadData() {
    init();
}

// Update the UI according to the activation/deactivation of the compatibility mode
function compaMode() {
    if(!audioProcessing) {
        if(compaAudioAPI) {
            setTooltip("playAudio", null, false, true, "wrapperPlay", true);
            setTooltip("pauseAudio", i18next.t("script.notAvailableCompatibilityMode"), true, false, "wrapperPause", true);
            document.getElementById("playingAudioInfos").style.display = "block";
            document.getElementById("checkLoopPlayDiv").style.display = "block";
        } else {
            checkButtonPlayAudioBuffer();
            setTooltip("stopAudio", null, false, true, "wrapperStop", true);
            document.getElementById("playingAudioInfos").style.display = "block";
            document.getElementById("checkLoopPlayDiv").style.display = "block";
        }

        if(typeof(Worker) !== "undefined" && Worker != null) {
            setTooltip("saveInputModify", null, false, true, "wrapperSave", true);
        } else {
            setTooltip("saveInputModify", i18next.t("script.notCompatible"), true, false, "wrapperSave", true);
        }
    }
}

// Update the UI according to the audio player state
function checkButtonPlayAudioBuffer() {
    if(audioBufferPlay.playing) {
        setTooltip("playAudio", null, true, false, "wrapperPlay", true);
        setTooltip("pauseAudio", null, false, true, "wrapperPause", true);
        document.getElementById("wrapperPlay").style.display = "none";
        document.getElementById("wrapperPause").style.display = "inline-block";
    } else {
        setTooltip("playAudio", null, false, true, "wrapperPlay", true);
        setTooltip("pauseAudio", null, true, false, "wrapperPause", true);
        document.getElementById("wrapperPlay").style.display = "inline-block";
        document.getElementById("wrapperPause").style.display = "none";
    }
}
// Set a tooltip on an element, with a text
// Can be also used to disabled or re-enable an element
// ByID specifies if the element need to be find by ID
// Display control if the element need to be displayed or not
function setTooltip(element, text, disable, enable, otherElement, byId, display) {
    // Default parameters
    element = element || null;
    otherElement = otherElement || null;
    text = text || null;
    disable = disable || false;
    enable = enable || false;
    byId = byId || false; // getElementById on element and otherElement
    display = display || false;
    // End of default parameters

    if(byId) {
        element = document.getElementById(element);
        otherElement = document.getElementById(otherElement);
    }

    if(disable) element.disabled = true;
    if(enable) element.disabled = false;

    if(text !== "" && text !== null) {
        if(otherElement !== null) {
            otherElement.setAttribute("data-original-title", text);
            window[otherElement + "_tooltip"] = new BSN.Tooltip(otherElement, {
                placement: 'bottom',
                animation: 'fade',
                delay: 50,
            });

            if(display) setTimeout(() => { window[otherElement + "_tooltip"].show() }, 150);
        } else {
            element.setAttribute("data-original-title", text);
            window[element + "_tooltip"] = new BSN.Tooltip(element, {
                placement: 'bottom',
                animation: 'fade',
                delay: 50,
            });

            if(display) setTimeout(() => { window[element + "_tooltip"].show() }, 150);
        }
    } else {
        if(otherElement !== null) {
            otherElement.removeAttribute("data-original-title");
            if(window[otherElement + "_tooltip"] && typeof(window[otherElement + "_tooltip"].hide) !== "undefined") window[otherElement + "_tooltip"].hide();
        } else {
            element.removeAttribute("data-original-title");
            if(window[element + "_tooltip"] && typeof(window[element + "_tooltip"].hide) !== "undefined") window[element + "_tooltip"].hide();
        }
    }

    if(otherElement !== null) {
        if(window[otherElement + "_tooltip"] && typeof(window[otherElement + "_tooltip"].hide) !== "undefined") return window[otherElement + "_tooltip"];
    } else {
        if(window[element + "_tooltip"] && typeof(window[element + "_tooltip"].hide) !== "undefined") return window[element + "_tooltip"];
    }

    return null;
}
// End of the others UI functions

// Initialization
// Load the audio buffers needed for reverberation and vocoder filters
function initAudioAPI(func) {
    audioImpulseResponses.loading = true;

    loadAudioBuffer(audioArray[0], (data, success) => {
        audioImpulseResponses[1].buffer = data;
        audioImpulseResponses.loading = false;
        checkAudioBuffer(audioImpulseResponses[1].buffer, "audio_impulse_response");
        loadReverbValues();

        loadAudioBuffer(audioArray[1], (data2, success2) => {
            audioBuffers.modulator = data2;
            checkAudioBuffer(audioBuffers.modulator, "audio_modulator");

            if(!success || !success2) {
                document.getElementById("errorLoading").style.display = "block";
            }

            return func(success && success2);
        });
    });
}

// Display information abouton compatibility of the app with web browser (if the browser isn't compatible)
function displayCompatibilityInfos() {
    if(!'AudioContext' in window || audioContextNotSupported) {
        document.getElementById("compa").style.display = "block";
        document.getElementById("compaInfo").innerHTML = i18next.t("script.browserNotCompatible");
        document.getElementById("firstEtape").style.display = "block";
        document.getElementById("fileSelect").disabled = true;
        document.getElementById("fileRecord").disabled = true;
    }

    if(typeof(navigator.mediaDevices) === "undefined" || typeof(navigator.mediaDevices.getUserMedia) === "undefined") {
        setTooltip("fileRecord", i18next.t("script.notAvailable"), true, false, "wrapperFileRecord", true);
    }

    if(typeof(Worker) !== "undefined" && Worker != null) {
        setTooltip("saveInputModify", "", false, true, "wrapperSave", true);
    } else {
        setTooltip("saveInputModify", i18next.t("script.browserNotCompatible"), true, false, "wrapperSave", true);
    }
}

// Init the app (called when the app is launched)
function init(func) {
    document.getElementById("loading").style.display = "block";
    document.getElementById("errorLoading").style.display = "none";
    document.getElementById("checkAudioRetour").checked = false;
    document.getElementById("version").innerHTML = app_version;
    document.getElementById("appVersion").innerHTML = app_version;
    document.getElementById("appUpdateDate").innerHTML = app_version_date;
    checkUpdate();

    initAudioAPI(result => {
        document.getElementById("loading").style.display = "none";
        document.getElementById("fileSelect").disabled = false;
        document.getElementById("fileRecord").disabled = false;
        setTooltip("fileRecord", "", false, true, "wrapperFileRecord", true);

        displayCompatibilityInfos();
        compaMode();

        if(typeof func !== 'undefined') {
            return func(true);
        } else {
            return true;
        }
    });
}

// When the app is launched, call init method and translate all the content
window.addEventListener("load", () => {
    init();
    setTimeout(translateContent, 250);
});
// End of initialization

// Onclick events
document.getElementById("connectionErrorRetry").addEventListener("click", reloadData);
document.getElementById("fileSelect").addEventListener("click", selectFile);
document.getElementById("fileRecord").addEventListener("click", recordAudio);
document.getElementById("recordAudioPlay").addEventListener("click", recordPlay);
document.getElementById("recordAudioPause").addEventListener("click", recordPause);
document.getElementById("recordAudioStop").addEventListener("click", recordStop);
document.getElementById("resetRecordAudio").addEventListener("click", launchReset);
document.getElementById("resetAudio").addEventListener("click", launchReset);
document.getElementById("playAudio").addEventListener("click", launchPlay);
document.getElementById("pauseAudio").addEventListener("click", launchPause);
document.getElementById("stopAudio").addEventListener("click", launchStop);
document.getElementById("checkCompa").addEventListener("click", compaMode);
document.getElementById("validInputModify").addEventListener("click", () => validModify(false, false));
document.getElementById("randomInputModify").addEventListener("click", randomModify);
document.getElementById("resetInputModify").addEventListener("click", resetModify);
document.getElementById("saveInputModify").addEventListener("click", launchSave);
document.getElementById("setLimiterValues").addEventListener("click", setLimiterValues);
document.getElementById("resetLimiterValues").addEventListener("click", resetLimiterValues);
document.getElementById("validateBassBoostValues").addEventListener("click", validateBassBoostValues);
document.getElementById("resetBassBoostValues").addEventListener("click", resetBassBoostValues);
document.getElementById("validateHighPassValues").addEventListener("click", validateHighPassValues);
document.getElementById("resetHighPassValues").addEventListener("click", resetHighPassValues);
document.getElementById("validateLowPassValues").addEventListener("click", validateLowPassValues);
document.getElementById("resetLowPassValues").addEventListener("click", resetLowPassValues);
document.getElementById("validateDelayValues").addEventListener("click", validateDelayValues);
document.getElementById("resetDelayValues").addEventListener("click", resetDelayValues);
document.getElementById("validReverbSettings").addEventListener("click", validateReverbValues);
document.getElementById("resetReverbSettings").addEventListener("click", resetReverbValues);
document.getElementById("cancelSaveCompaMode").addEventListener("click", () => { compaModeSaveStop(); });

// Updater
// Begin check for updates
function checkUpdate() {
    const script = document.createElement("script");
    script.src = updater_uri;

    document.getElementsByTagName('head')[0].appendChild(script);
}

// Callback called when the update data has finished to download
window.updateCallback = data => {
    if(typeof(data) !== "undefined" && data !== null && typeof(data.version) !== "undefined" && data.version !== null) {
        const newVersionTest = app_version.strcmp(data.version);

        if(newVersionTest < 0) {
            document.getElementById("updateAvailable").style.display = "block";
            document.getElementById("appUpdateVersion").textContent = data.version;

            let appUpdateDate = app_version_date;

            if(typeof(data.date) !== "undefined" && data.date !== null) {
                appUpdateDate = data.date;
            }

            document.getElementById("appUpdateDate").textContent = appUpdateDate;

            let downloadURL = "http://eliastiksofts.com/simple-voice-changer/downloads/index.php";

            if(typeof(data.url) !== "undefined" && data.url !== null) {
                downloadURL = data.url;
            }

            document.getElementById("appDownloadLink").onclick = () => {
                window.open(downloadURL, '_blank');
            };

            document.getElementById("appDownloadURLGet").onclick = () => {
                prompt(i18next.t("update.URLToDownload"), downloadURL);
            };

            let changes = i18next.t("update.noChanges");

            if(typeof(data.changes) !== "undefined" && data.changes !== null) {
                changes = data.changes;
            }

            document.getElementById("appUpdateChanges").onclick = () => {
                launchPause();
                alert(i18next.t("update.changes") + "\n" + changes);
            };

            translateContent();
        }
    }
}
// End of updater

// Localization
// List all languages supported
function listTranslations(languages) {
    if(languages != null) {
      document.getElementById("languageSelect").disabled = true;
      document.getElementById("languageSelect").innerHTML = "";

      for(let i = 0; i < languages.length; i++) {
          document.getElementById("languageSelect").innerHTML = document.getElementById("languageSelect").innerHTML + '<option data-i18n="lang.' + languages[i] + '" value="'+ languages[i] +'"></option>';
      }

      document.getElementById("languageSelect").value = i18next.language.substr(0, 2);
      document.getElementById("languageSelect").disabled = false;
    }
}

// Translate the content
function translateContent() {
    listTranslations(i18next.languages);

    const i18nList = document.querySelectorAll("[data-i18n]");

    for(let i = 0, l = i18nList.length; i < l; i++) {
        i18nList[i].innerHTML = i18next.t(i18nList[i].dataset.i18n);
    }

    document.getElementById("versionDate").innerHTML = new Intl.DateTimeFormat(i18next.language).format(new Date(app_version_date));

    document.getElementById("appDownloadURLGet").title = i18next.t("update.getURL");
    document.getElementById("appUpdateChanges").title = i18next.t("update.getChanges");

    document.getElementById("appUpdateDateLocalized").innerHTML = i18next.t("update.versionDate", { date: new Intl.DateTimeFormat(i18next.language).format(new Date(document.getElementById("appUpdateDate").innerHTML)) });

    displayCompatibilityInfos();
    checkAudioBuffer(audioImpulseResponses[1].buffer, "audio_impulse_response");
    checkAudioBuffer(audioBuffers.modulator, "audio_modulator");
}

// When another language is selected, translate the content
document.getElementById("languageSelect").onchange = function() {
    i18next.changeLanguage(document.getElementById("languageSelect").value, (err, t) => {
        translateContent();
    });
};
// End of localization

// Installable app
if("serviceWorker" in navigator) {
    navigator.serviceWorker.register("service-worker.js");
}

window.onbeforeunload = () => {
    launchPause();
    recordPause();
    return i18next.t("script.appClosing");
};