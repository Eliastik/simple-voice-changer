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

// Pure JS. No Jquery.
// Default variables
var speedAudio, pitchAudio, modifyFirstClick, reverbAudio, compaAudioAPI, vocoderAudio, lowpassAudio, phoneAudio, returnAudio, bassboostAudio, compatModeChecked, audioContextNotSupported, audioProcessing, removedTooltipInfo, audio_principal_buffer, audio_impulse_response, audio_modulator, audioBufferPlay, compaModeStop;

speedAudio = pitchAudio = 1;
reverbAudio = compaAudioAPI = vocoderAudio = lowpassAudio = bassboostAudio = phoneAudio = returnAudio = compatModeChecked = audioContextNotSupported = audioProcessing = removedTooltipInfo = false;
audio_principal_buffer = audio_impulse_response = audio_modulator = null;
audioBufferPlay = new playBufferAudioAPI(null);
compaModeStop = function() { return false };

// Settings
var filesDownloadName = "simple_voice_changer";
var audioArray = ["assets/sounds/impulse_response.mp3", "assets/sounds/modulator.mp3"]; // audio to be loaded when launching the app
var app_version = "1.1";
var app_version_date = "2019-7-15";
var updater_uri = "https://www.eliastiksofts.com/simple-voice-changer/update.php"
// End of the settings

// Libs
String.prototype.strcmp = function(str) {
    return ((this == str) ? 0 : ((this > str) ? 1 : -1));
};

if(!String.prototype.trim) {
    String.prototype.trim = function () {
        return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
    };
}
// End libs

if('AudioContext' in window) {
    try {
        var AudioContext = window.AudioContext || window.webkitAudioContext;
        var context = new AudioContext();
    } catch(e) {
        if(typeof(window.console.error) !== 'undefined') {
            console.error(window.i18next.t("script.errorAudioContext"), e);
        } else {
            console.log(window.i18next.t("script.errorAudioContext"), e);
        }

        var audioContextNotSupported = true;
    }
} else {
    var audioContextNotSupported = true;
}

navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || null);
// End of the default variables

var slider = new Slider("#pitchRange", {
    formatter: function(value) {
        return value;
    }
});

var slider2 = new Slider("#speedRange", {
    formatter: function(value) {
        return value;
    }
});

function checkAudio(type) {
    if(!window.HTMLAudioElement) {
        return false;
    }

    var audio = document.createElement("audio");

    if(!audio.canPlayType(type)) {
        return "no mp3 support";
    }

    return true;
}

function reloadData() {
    init();
}

var checkAudio = checkAudio("audio/mp3");

function compaMode() {
    if(!audioProcessing) {
        if(compaAudioAPI) {
            setTooltip("playAudio", null, false, true, "wrapperPlay", true);
            setTooltip("pauseAudio", window.i18next.t("script.notAvailableCompatibilityMode"), true, false, "wrapperPause", true);
            document.getElementById("playingAudioInfos").style.display = "none";
        } else {
            checkButtonPlayAudioBuffer();
            setTooltip("stopAudio", null, false, true, "wrapperStop", true);
            document.getElementById("playingAudioInfos").style.display = "block";
        }

        if (typeof(Worker) !== "undefined" && Worker != null) {
            setTooltip("saveInputModify", null, false, true, "wrapperSave", true);
        } else {
            setTooltip("saveInputModify", window.i18next.t("script.notCompatible"), true, false, "wrapperSave", true);
        }
    }
}

function checkButtonPlayAudioBuffer() {
    if(audioBufferPlay.playing) {
        setTooltip("playAudio", null, true, false, "wrapperPlay", true);
        setTooltip("pauseAudio", null, false, true, "wrapperPause", true);
    } else {
        setTooltip("playAudio", null, false, true, "wrapperPlay", true);
        setTooltip("pauseAudio", null, true, false, "wrapperPause", true);
    }
}

function selectFile() {
    document.getElementById("inputFile").click();
}

document.getElementById("inputFile").addEventListener("change", function() {
    document.getElementById("errorLoadingSelectFile").style.display = "none";
    document.getElementById("firstEtape").style.display = "none";
    document.getElementById("secondEtape").style.display = "block";

    var reader = new FileReader();

    reader.onload = function(ev) {
        context.resume();

        context.decodeAudioData(ev.target.result, function(buffer) {
            loadPrincipalBuffer(buffer);
        }).catch(function(err) {
            document.getElementById("errorLoadingSelectFile").style.display = "block";
            document.getElementById("firstEtape").style.display = "block";
            document.getElementById("secondEtape").style.display = "none";
        });
    };

    reader.readAsArrayBuffer(this.files[0]);
}, false);

function loadPrincipalBuffer(buffer) {
    if(buffer.numberOfChannels == 1) { // convert to stereo buffer
        context.resume();
        audio_principal_buffer = context.createBuffer(2, context.sampleRate * buffer.duration + context.sampleRate * 2, context.sampleRate);

        for(var channel = 0; channel < audio_principal_buffer.numberOfChannels; channel++) {
            var nowBuffering = audio_principal_buffer.getChannelData(channel);

            for(var i = 0; i < buffer.length; i++) {
                nowBuffering[i] = buffer.getChannelData(0)[i];
            }
        }
    } else {
        audio_principal_buffer = buffer;
    }

    document.getElementById("firstEtapeBis").style.display = "none";
    document.getElementById("secondEtape").style.display = "none";
    document.getElementById("thirdEtape").style.display = "block";
    document.getElementById("lastEtape").style.display = "block";

    validModify(false, false);
}

function add(a, b) {
    return a + b;
}

function calcAudioDuration(audio, speed, pitch, reverb, vocode) {
    var duration = audio.duration + 1;

    duration = duration / parseFloat(speed);
    if(reverb) duration = duration + 5;

    return duration;
}

function getTelephonizer(context) {
    var lpf1 = context.createBiquadFilter();
    lpf1.type = "lowpass";
    lpf1.frequency.value = 2000.0;
    var lpf2 = context.createBiquadFilter();
    lpf2.type = "lowpass";
    lpf2.frequency.value = 2000.0;
    var hpf1 = context.createBiquadFilter();
    hpf1.type = "highpass";
    hpf1.frequency.value = 500.0;
    var hpf2 = context.createBiquadFilter();
    hpf2.type = "highpass";
    hpf2.frequency.value = 500.0;
    lpf1.connect(lpf2);
    lpf2.connect(hpf1);
    hpf1.connect(hpf2);
    currentEffectNode = lpf1;

    return {
      "input": lpf1,
      "output": hpf2
    };
}

function returnBuffer(buffer) {
    context.resume();

    var bufferReturned = context.createBuffer(2, context.sampleRate * buffer.duration + context.sampleRate * 2, context.sampleRate);

    for(var channel = 0; channel < buffer.numberOfChannels; channel++) {
        var nowBuffering = bufferReturned.getChannelData(channel);

        for(var i = 0; i < bufferReturned.length; i++) {
            nowBuffering[i] = buffer.getChannelData(channel)[buffer.length - 1 - i];
        }
    }

    bufferReturned.buffer = nowBuffering;

    return bufferReturned;
}

function renderAudioAPI(audio, speed, pitch, reverb, save, play, audioName, comp, vocode, lowpass, bassboost, phone, returnAudioParam, rate, BUFFER_SIZE) {
    // Default parameters
    var speed = speed || 1; // Speed of the audio
    var pitch = pitch || 1; // Pitch of the audio
    var reverb = reverb == undefined ? false : reverb; // Enable or disable reverb
    var save = save == undefined ? false : save; // Save the audio buffer under a wav file
    var play = play == undefined ? false : play; // Play the audio
    var audioName = audioName || "sample"; // The audio buffer variable name (global)
    var comp = comp == undefined ? false : comp; // Enable or disable the compatibility mode
    var vocode = vocode == undefined ? false : vocode; // Enable or disable vocoder
    var lowpass = lowpass == undefined ? false : lowpass; // Enable lowPass filter
    var bassboost = bassboost == undefined ? false : bassboost; // Enable Bass Boost
    var phone = phone == undefined ? false : phone; // Enable Phone Call
    var returnAudioParam = returnAudioParam == undefined ? false : returnAudioParam; // Enable Audio Return
    var rate = rate || 1; // Rate of the audio
    var BUFFER_SIZE = BUFFER_SIZE || 4096; // Buffer size of the audio
    // End of default parameters

    if ('AudioContext' in window && !audioContextNotSupported) {
        var durationAudio = calcAudioDuration(audio, speed, pitch, reverb, vocode);

        if(!comp) {
            var offlineContext = new OfflineAudioContext(2, context.sampleRate * durationAudio, context.sampleRate);
        } else {
            var offlineContext = context;
        }

        if(typeof(audio_impulse_response) == "undefined" || audio_impulse_response == null) reverb = false;
        if(typeof(audio_modulator) == "undefined" || audio_modulator == null) vocode = false;

        document.getElementById("processingModifLoader").style.display = "block";
        document.getElementById("validInputModify").disabled = true;
        document.getElementById("saveInputModify").disabled = true;
        document.getElementById("resetAudio").disabled = true;
        audioProcessing = true;

        function renderAudio(buffer) {
            if(returnAudioParam) {
                buffer = returnBuffer(buffer);
            }

            var st = new soundtouch.SoundTouch(44100);
            st.pitch = pitch;
            st.tempo = speed;
            st.rate = rate;
            var filter = new soundtouch.SimpleFilter(new soundtouch.WebAudioBufferSource(buffer), st);
            var node = soundtouch.getWebAudioNode(offlineContext, filter);

            if(lowpass) {
                var lowPassFilter = offlineContext.createBiquadFilter();
                lowPassFilter.type = "lowpass";
                lowPassFilter.frequency.value = 3500;
            }

            if(bassboost) {
                var bassBoostFilter = offlineContext.createBiquadFilter();
                bassBoostFilter.type = "lowshelf";
                bassBoostFilter.frequency.value = 250;
                bassBoostFilter.gain.value = 15;
            }

            var limiter = new Limiter(context.sampleRate);
            var limiterProcessor = offlineContext.createScriptProcessor(BUFFER_SIZE, buffer.numberOfChannels, buffer.numberOfChannels);
	          limiterProcessor.onaudioprocess = limiter.limit;

            if(phone) {
                var tel = getTelephonizer(offlineContext);
            }

            var output = limiterProcessor;

            if(reverb) {
                convolver.buffer = audio_impulse_response;
                convolver.connect(limiterProcessor);
                output = convolver;
            }

            if(phone) {
                tel["output"].connect(output);
                output = tel["input"];
            }

            if(lowpass) {
                node.connect(lowPassFilter);

                if(bassboost) {
                    lowPassFilter.connect(bassBoostFilter);
                    bassBoostFilter.connect(output);
                } else {
                    lowPassFilter.connect(output);
                }
            } else {
                if(bassboost) {
                    node.connect(bassBoostFilter);
                    bassBoostFilter.connect(output);
                } else {
                    node.connect(output);
                }
            }

            if(!comp) {
                limiterProcessor.connect(offlineContext.destination);

                offlineContext.oncomplete = function(e) {
                    window[audioName] = e.renderedBuffer;
                    audioBufferPlay.loadBuffer(window[audioName]);

                    document.getElementById("validInputModify").disabled = false;
                    document.getElementById("resetAudio").disabled = false;
                    document.getElementById("processingModifLoader").style.display = "none";
                    audioProcessing = false;
                    compaMode();

                    if(!compatModeChecked) {
                        var sum = e.renderedBuffer.getChannelData(0).reduce(add, 0);

                        if(sum == 0) {
                            document.getElementById("checkCompa").checked = true;
                            compaMode();
                            document.getElementById("compatAutoDetected").style.display = "block";
                            compaAudioAPI = true;
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
            } else {
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
                    limiterProcessor.connect(offlineContext.destination);

                    compaModeStop = function() {
                        try {
                            limiterProcessor.disconnect(offlineContext.destination);
                            return true;
                        } catch(e) {
                            return false;
                        }
                    };

                    if(save) {
                        var rec = new Recorder(limiterProcessor, { workerPath: "assets/js/recorderWorker.js" });

                        var timer = new timerSaveTime("timeFinishedDownload", "progressProcessingSave", Math.round(durationAudio), -1);
                        timer.start();
                        rec.record();

                        setTimeout(function() {
                            rec.stop();

                            rec.exportWAV(function(blob) {
                                downloadAudioBlob(blob);
                                timer.stop();

                                document.getElementById("validInputModify").disabled = false;
                                document.getElementById("resetAudio").disabled = false;
                                document.getElementById("playAudio").disabled = false;
                                document.getElementById("stopAudio").disabled = false;
                                document.getElementById("processingSave").style.display = "none";
                                audioProcessing = false;
                                compaMode();
                            });
                        }, durationAudio * 1000);
                    }
                }
            }
        }

        if(reverb) var convolver = offlineContext.createConvolver();

        if(vocode) {
            var offlineContext2 = new OfflineAudioContext(2, context.sampleRate * durationAudio, context.sampleRate);

            if(comp) {
                document.getElementById("playAudio").disabled = true;
                document.getElementById("stopAudio").disabled = true;
            }

            offlineContext2.oncomplete = function(e) {
                renderAudio(e.renderedBuffer);

                if(comp) {
                    document.getElementById("playAudio").disabled = false;
                    document.getElementById("stopAudio").disabled = false;
                }
            };

            vocoder(offlineContext2, audio_modulator, audio);
            offlineContext2.startRendering();
        } else {
            renderAudio(audio);
        }
    } else {
        if(typeof(window.console.error) !== 'undefined') console.error(window.i18next.t("script.webAudioNotSupported"));
        return false;
    }
}

function playBufferAudioAPI() {
    this.buffer;
    this.source;
    this.currentTime = 0;
    this.duration = 0;
    this.interval;
    this.playing = false;

    var obj = this;

    this.init = function() {
        this.playing = false;
        context.resume();
        this.source = context.createBufferSource();
        this.source.buffer = this.buffer;
        this.duration = this.buffer.duration;
        this.source.connect(context.destination);
        this.updateInfos();
    };

    this.loadBuffer = function(buffer) {
        this.reset();
        this.buffer = buffer;
        this.init();
    };

    this.reset = function() {
        clearInterval(this.interval);
        this.currentTime = 0;
        this.stop();
    };

    this.stop = function() {
        if(this.source != undefined && this.source != null && this.playing) {
            this.source.stop(0);
            this.playing = false;
        }

        this.updateInfos();
    };

    this.start = function() {
        if(this.source != undefined && this.source != null) {
            this.stop();
            this.init();
            this.source.start(0, this.currentTime);
            this.playing = true;

            this.interval = setInterval(function() {
                obj.currentTime += 0.2;
                obj.updateInfos();

                if(obj.currentTime > obj.duration) {
                    obj.reset();
                    compaMode();
                }
            }, 200);
        }
    };

    this.pause = function() {
        clearInterval(this.interval);
        this.stop();
    };

    this.updateInfos = function() {
        if(document.getElementById("timePlayingAudio") != null) document.getElementById("timePlayingAudio").innerHTML = ("0" + Math.trunc(this.currentTime / 60)).slice(-2) + ":" + ("0" + Math.trunc(this.currentTime % 60)).slice(-2);
        if(document.getElementById("totalTimePlayingAudio") != null) document.getElementById("totalTimePlayingAudio").innerHTML = ("0" + Math.trunc(this.duration / 60)).slice(-2) + ":" + ("0" + Math.trunc(this.duration % 60)).slice(-2);
        if(document.getElementById("progressPlayingAudio") != null) document.getElementById("progressPlayingAudio").style.width = Math.round(this.currentTime / this.duration * 100) + "%";
    };
}

function saveBuffer(buffer) {
    if(typeof(Worker) !== "undefined" && Worker != null) {
        var worker = new Worker("assets/js/recorderWorker.js");
    } else {
        if(typeof(window.console.error) !== 'undefined') console.error(window.i18next.t("script.workersNotSupported"));
        return false;
    }

    if ('AudioContext' in window && !audioContextNotSupported) {
        worker.postMessage({
            command: "init",
            config: {
                sampleRate: context.sampleRate,
                numChannels: 2
            }
        });

        worker.onmessage = function(e) {
            downloadAudioBlob(e.data);
        };

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
        if(typeof(window.console.error) !== 'undefined') console.error(window.i18next.t("script.webAudioNotSupported"));
        return false;
    }
}

function downloadAudioBlob(e) {
    var blob = e;
    var a = document.createElement("a");
    var url = URL.createObjectURL(blob);
    document.body.appendChild(a);
    a.style = "display: none";
    a.href = url;
    a.download = filesDownloadName + "-" + new Date().toISOString() + ".wav";
    a.click();
    window.URL.revokeObjectURL(url);
}

function validModify(play, save) {
    // Default parameters
    var play = play || false;
    var save = save || false;
    // End of default parameters

    try {
        var tmp_pitch = document.getElementById("pitchRange").value;
        var tmp_speed = document.getElementById("speedRange").value;
    } catch(e) {
        alert(window.i18next.t("script.errorOccured"));
        return false;
    }

    if(isNaN(tmp_pitch) || tmp_pitch == "" || tmp_pitch <= 0 || tmp_pitch > 5) {
        alert(window.i18next.t("script.invalidPitch"));
        document.getElementById("pitchRange").value = pitchAudio;
        document.getElementById("speedRange").value = speedAudio;
        return false;
    } else if(isNaN(tmp_speed) || tmp_speed == "" || tmp_speed <= 0 || tmp_speed > 5) {
        alert(window.i18next.t("script.invalidSpeed"));
        document.getElementById("pitchRange").value = pitchAudio;
        document.getElementById("speedRange").value = speedAudio;
        return false;
    } else {
        pitchAudio = tmp_pitch;
        speedAudio = tmp_speed;
        if(document.getElementById("checkReverb").checked == true) reverbAudio = true; else reverbAudio = false;
        if(document.getElementById("checkCompa").checked == true) compaAudioAPI = true; else compaAudioAPI = false;
        if(document.getElementById("checkVocode").checked == true) vocoderAudio = true; else vocoderAudio = false;
        if(document.getElementById("checkLowpass").checked == true) lowpassAudio = true; else lowpassAudio = false;
        if(document.getElementById("checkBassBoost").checked == true) bassboostAudio = true; else bassboostAudio = false;
        if(document.getElementById("checkPhone").checked == true) phoneAudio = true; else phoneAudio = false;
        if(document.getElementById("checkReturnAudio").checked == true) returnAudio = true; else returnAudio = false;

        launchStop();
        compaMode();

        if(compaAudioAPI) {
            if(checkAudio !== true || play !== true) {
                document.getElementById("validInputModify").disabled = false;
            }

            if(play) {
                launchPlay();
            }
        } else {
            renderAudioAPI(audio_principal_buffer, speedAudio, pitchAudio, reverbAudio, save, play, "audio_principal_processed", compaAudioAPI, vocoderAudio, lowpassAudio, bassboostAudio, phoneAudio, returnAudio);
        }

        return true;
    }

    return false;
}

function launchPlay() {
    if(typeof(audio_principal_processed) !== "undefined" && audio_principal_processed != null && !compaAudioAPI) {
        audioBufferPlay.start();
        checkButtonPlayAudioBuffer();
    } else if(compaAudioAPI) {
        launchStop();
        renderAudioAPI(audio_principal_buffer, speedAudio, pitchAudio, reverbAudio, false, true, "audio_principal_processed", compaAudioAPI, vocoderAudio, lowpassAudio, bassboostAudio, phoneAudio, returnAudio);
    }
}

function launchStop() {
    audioBufferPlay.reset();
    compaModeStop();
    checkButtonPlayAudioBuffer();
}

function launchPause() {
    if(!compaAudioAPI) {
        audioBufferPlay.pause();
        checkButtonPlayAudioBuffer();
    }
}

function launchSave() {
    if(!audioProcessing && typeof(audio_principal_processed) !== "undefined" && audio_principal_processed != null && !compaAudioAPI) {
        saveBuffer(audio_principal_processed);
    } else if(compaAudioAPI) {
        launchStop();
        renderAudioAPI(audio_principal_buffer, speedAudio, pitchAudio, reverbAudio, true, true, "audio_principal_processed", compaAudioAPI, vocoderAudio, lowpassAudio, bassboostAudio, phoneAudio, returnAudio);
    }
}

function launchReset() {
    if(!audioProcessing && confirm(window.i18next.t("script.launchReset"))) {
        document.getElementById("firstEtape").style.display = "block";
        document.getElementById("secondEtape").style.display = "none";
        document.getElementById("thirdEtape").style.display = "none";
        document.getElementById("lastEtape").style.display = "none";
        document.getElementById("firstEtapeBis").style.display = "none";
        document.getElementById("inputFile").value = "";
        resetModify();
        launchStop();
        recorderVoice.reset();
    }
}

function resetModify() {
    document.getElementById("checkReverb").checked = false;
    document.getElementById("checkVocode").checked = false;
    document.getElementById("checkLowpass").checked = false;
    document.getElementById("checkBassBoost").checked = false;
    document.getElementById("checkPhone").checked = false;
    document.getElementById("checkReturnAudio").checked = false;
    slider.setValue(1.0);
    slider2.setValue(1.0);
}

function randomRange(min, max) {
    return ((Math.random() * max) + min).toFixed(1);
}

function randomBool() {
    return Math.round(Math.random()) == 0 ? false : true;
}

function randomModify() {
    var checkReverb = document.getElementById("checkReverb");
    var checkVocode = document.getElementById("checkVocode");
    var checkLowpass = document.getElementById("checkLowpass");
    var checkBassBoost = document.getElementById("checkBassBoost");
    var checkPhone = document.getElementById("checkPhone");
    var checkReturnAudio = document.getElementById("checkReturnAudio");

    if(!checkReverb.disabled) {
        checkReverb.checked = randomBool();
    }

    if(!checkVocode.disabled) {
        checkVocode.checked = randomBool();
    }

    if(!checkLowpass.disabled) {
        checkLowpass.checked = randomBool();
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

    slider.setValue(randomRange(0.1, 5.0));
    slider2.setValue(randomRange(0.1, 5.0));
}

function recordVoice() {
    this.input;
    this.stream;
    this.recorder;
    this.alreadyInit;
    this.timer;

    this.init = function() {
        document.getElementById("waitRecord").style.display = "block";
        document.getElementById("errorRecord").style.display = "none";

        var self = this;
        var constraints = {
            audio: {
              noiseSuppression: false
            }
        };

        navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
            context.resume();
            self.input = context.createMediaStreamSource(stream);
            self.stream = stream;
            self.recorder = new Recorder(self.input, { workerPath: "assets/js/recorderWorker.js" });
            self.alreadyInit = true;
            self.timer = new timerSaveTime("timeRecord", null, 0, 1);
            document.getElementById("errorRecord").style.display = "none";
            document.getElementById("waitRecord").style.display = "none";
            document.getElementById("recordAudioPlay").disabled = false;
            document.getElementById("checkAudioRetour").disabled = false;
            document.getElementById("checkAudioRetourGroup").setAttribute("class", "checkbox");
        }).catch(function(e) {
            document.getElementById("errorRecord").style.display = "block";
            document.getElementById("waitRecord").style.display = "none";
            document.getElementById("recordAudioPlay").disabled = true;
            document.getElementById("checkAudioRetour").disabled = true;
            document.getElementById("checkAudioRetourGroup").setAttribute("class", "checkbox disabled");
        });
    };

    this.audioFeedback = function(enable) {
        if(enable) {
            this.input && this.input.connect(context.destination);
        } else {
            this.input && this.input.connect(context.destination) && this.input.disconnect(context.destination);
        }
    };

    this.record = function() {
        if(this.alreadyInit) {
            this.recorder && this.recorder.record();
            this.timer && this.timer.start();

            document.getElementById("recordAudioPlay").disabled = true;
            document.getElementById("recordAudioPause").disabled = false;
            document.getElementById("recordAudioStop").disabled = false;
        }
    };

    this.stop = function() {
        if(this.alreadyInit) {
            this.recorder && this.recorder.stop();
            this.timer && this.timer.stop();

            var self = this;

            this.recorder.getBuffer(function(buffer) {
                context.resume();
                var newSource = context.createBufferSource();
                var newBuffer = context.createBuffer(2, buffer[0].length, context.sampleRate);
                newBuffer.getChannelData(0).set(buffer[0]);
                newBuffer.getChannelData(1).set(buffer[1]);
                newSource.buffer = newBuffer;

                loadPrincipalBuffer(newBuffer);
                self.reset();
            });
        }
    };

    this.pause = function() {
        if(this.alreadyInit) {
            this.recorder && this.recorder.stop();
            this.timer && this.timer.stop();

            document.getElementById("recordAudioPlay").disabled = false;
            document.getElementById("recordAudioPause").disabled = true;
            document.getElementById("recordAudioStop").disabled = false;
        }
    };

    this.reset = function() {
        this.recorder && this.recorder.stop();
        this.recorder && this.recorder.clear();
        this.timer && this.timer.stop();
        this.audioFeedback(false);

        if(this.stream && this.stream.stop) {
            this.stream.stop();
        } else if(this.stream) {
            this.stream.getTracks().forEach(function(track) {
                track.stop()
            });
        }

        this.input = null;
        this.recorder = null;
        this.stream = null;
        this.alreadyInit = false;
        this.timer = null;

        document.getElementById("recordAudioPlay").disabled = true;
        document.getElementById("recordAudioPause").disabled = true;
        document.getElementById("recordAudioStop").disabled = true;
        document.getElementById("checkAudioRetour").checked = false;
        document.getElementById("checkAudioRetour").disabled = true;
        document.getElementById("checkAudioRetourGroup").setAttribute("class", "checkbox disabled");
        document.getElementById("timeRecord").innerHTML = "00:00";
    };
}

var recorderVoice = new recordVoice();

function recordAudio() {
    document.getElementById("firstEtape").style.display = "none";
    document.getElementById("firstEtapeBis").style.display = "block";
    recorderVoice.init();
}

function recordPlay() {
    recorderVoice.record();
}

function recordPause() {
    recorderVoice.pause();
}

function recordStop() {
    recorderVoice.stop();
}

document.getElementById("checkAudioRetour").onchange = function() {
    if(this.checked) {
        recorderVoice.audioFeedback(true);
    } else {
        recorderVoice.audioFeedback(false);
    }
};

function setTooltip(element, text, disable, enable,  otherElement, byId, display) {
    // Default parameters
    var element = element || null;
    var otherElement = otherElement || null;
    var text = text || null;
    var disable = disable || false;
    var enable = enable || false;
    var byId = byId || false; // getElementById on element and otherElement
    var display = display || false;
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
            window[otherElement + "_tooltip"] = new Tooltip(otherElement, {
                placement: 'bottom',
                animation: 'fade',
                delay: 50,
            });

            if(display) setTimeout(function() { window[otherElement + "_tooltip"].show() }, 150);
        } else {
            element.setAttribute("data-original-title", text);
            window[element + "_tooltip"] = new Tooltip(element, {
                placement: 'bottom',
                animation: 'fade',
                delay: 50,
            });

            if(display) setTimeout(function() { window[element + "_tooltip"].show() }, 150);
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

function removeTooltipInfo() {
    if(!removedTooltipInfo) {
        setTooltip("animation_img", "", false, true,  null, true, false);
        removedTooltipInfo = true;
    }
}

function timerSaveTime(id, idProgress, seconds, incr) {
    this.id = id;
    this.idProgress = idProgress;
    this.seconds = seconds;
    this.initialSeconds = seconds;
    this.interval;
    this.incr = incr;

    var obj = this;

    this.start = function() {
        document.getElementById(this.id).innerHTML = ("0" + Math.trunc(this.seconds / 60)).slice(-2) + ":" + ("0" + Math.trunc(this.seconds % 60)).slice(-2);

        if(this.idProgress != null && document.getElementById(this.idProgress) != null) document.getElementById(idProgress).style.width = "0%";

        this.interval = setInterval(function() {
            obj.count();
        }, 1000);
    };

    this.stop = function() {
        clearInterval(this.interval);
    };

    this.count = function() {
        this.seconds += this.incr;

        if(document.getElementById(obj.id) != null) document.getElementById(obj.id).innerHTML = ("0" + Math.trunc(this.seconds / 60)).slice(-2) + ":" + ("0" + Math.trunc(this.seconds % 60)).slice(-2);

        if(obj.idProgress != null && document.getElementById(obj.idProgress) != null) document.getElementById(idProgress).style.width = Math.round((obj.initialSeconds - obj.seconds) / obj.initialSeconds * 100) + "%";

        if(this.seconds <= 0) {
            this.stop();
        }
    };
}

function sumImgSizes(array) {
    var sum = 0;

    for(var i = 0, l = array.length; i < l; i++) {
        if(!isNaN(array[i])) {
            sum += array[i];
        }
    }

    return sum;
}

function makeArrayForPreload(array, index, from, to) {
    var output = [];

    for(var i = from; i < to; i++) {
        output.push(array[i][index]);
    }

    return output;
}

function preloadAudios(array, func) {
    var msgLoading = window.i18next.t("loading.audioLoading") + " ";

    if(window.HTMLAudioElement) {
        var audioTestMp3 = document.createElement('audio');

        if(audioTestMp3.canPlayType && audioTestMp3.canPlayType("audio/mpeg")) {
            document.getElementById("loadingInfo").innerHTML = msgLoading + "0/" + array.length;
            document.getElementById("timeLoadingInfo").innerHTML = "";

            var loadedAudioCount = 0;
            var errorLoadingAudio = false;
            var audioFiles = array;
            var audioFilesLoaded = [];

            var errorLoadingAudioFunction = function() {
                if(audioFilesLoaded.indexOf(this.src) == -1) {
                    var errorLoadingAudio = true;

                    loadedAudioCount++;
                    document.getElementById("loadingInfo").innerHTML = msgLoading + loadedAudioCount + "/" + array.length;
                    document.getElementById("errorLoading").style.display = "block";

                    audioFilesLoaded.push(this.src);

                    if(loadedAudioCount >= audioFiles.length) {
                        if(typeof func !== 'undefined') {
                            return func(false);
                        } else {
                            return false;
                        }
                    }
                }
            };

            var timeOutLoading = setTimeout(function() {
                if(loadedAudioCount == 0) {
                    if(typeof func !== 'undefined') {
                        return func(false);
                    } else {
                        return false;
                    }
                }
            }, 5000);

            for(var i = 0; i < audioFiles.length; i++) {
                var audioPreload = new Audio();
                audioPreload.src = audioFiles[i];
                audioPreload.preload = "auto";

                audioPreload.oncanplaythrough = function() {
                    if(audioFilesLoaded.indexOf(this.src) == -1) {
                        loadedAudioCount++;
                        document.getElementById("loadingInfo").innerHTML = msgLoading + loadedAudioCount + "/" + array.length;

                        audioFilesLoaded.push(this.src);

                        if(loadedAudioCount >= audioFiles.length) {
                            if(typeof func !== 'undefined') {
                                return func(true);
                            } else {
                                return true;
                            }
                        }
                    }
                };

                audioPreload.onerror = errorLoadingAudioFunction;
                audioPreload.onstalled = errorLoadingAudioFunction;
            }
        } else {
            if(typeof func !== 'undefined') {
                return func(false);
            } else {
                return false;
            }
        }
    } else {
        if(typeof func !== 'undefined') {
            return func(false);
        } else {
            return false;
        }
    }
}

function loadAudioAPI(audio, dest, func) {
    if('AudioContext' in window && !audioContextNotSupported) {
        var request = new XMLHttpRequest();
        request.open('GET', audio, true);
        request.responseType = 'arraybuffer';

        request.onload = function() {
            checkAudioBuffer(dest);

            context.decodeAudioData(request.response, function(data) {
                window[dest] = data;
                checkAudioBuffer(dest);

                if(typeof func !== 'undefined') {
                    return func(true);
                }
            });
        }

        request.onreadystatechange = function() {
            checkAudioBuffer(dest);
        }

        request.onerror = function() {
            if(typeof func !== 'undefined') {
                return func(false);
            }
        }

        request.send();
    } else {
        if(typeof(window.console.error) !== 'undefined') console.error(window.i18next.t("script.webAudioNotSupported"));

        if(typeof func !== 'undefined') {
            return func(false);
        } else {
            return false;
        }
    }
}

function checkAudioBuffer(bufferName) {
    var errorText = window.i18next.t("loading.errorLoadingTooltip");

    if ('AudioContext' in window && !audioContextNotSupported) {
        switch(bufferName) {
            case "audio_impulse_response":
                if(typeof(audio_impulse_response) == "undefined" || audio_impulse_response == null) {
                    setTooltip("checkReverb", errorText, true, false, "checkReverbWrapper", true);
                    document.getElementById("checkReverb").checked = false;
                    document.getElementById("checkReverbGroup").setAttribute("class", "checkbox disabled");
                } else {
                    setTooltip("checkReverb", "", false, true, "checkReverbWrapper", true);
                    document.getElementById("checkReverb").checked = false;
                    document.getElementById("checkReverbGroup").setAttribute("class", "checkbox");
                }
            break;
            case "audio_modulator":
                if(typeof(audio_modulator) == "undefined" || audio_modulator == null) {
                    setTooltip("checkVocode", errorText, true, false, "checkVocodeWrapper", true);
                    document.getElementById("checkVocode").checked = false;
                    document.getElementById("checkVocodeGroup").setAttribute("class", "checkbox disabled");
                } else {
                    setTooltip("checkVocode", "", false, true, "checkVocodeWrapper", true);
                    document.getElementById("checkVocode").checked = false;
                    document.getElementById("checkVocodeGroup").setAttribute("class", "checkbox");
                }
            break;
        }
    }
}

function initAudioAPI() {
    loadAudioAPI(audioArray[0], "audio_impulse_response", function() {
        loadAudioAPI(audioArray[1], "audio_modulator", function() {
            if(typeof(audio_impulse_response) == "undefined" || audio_impulse_response == null || typeof(audio_modulator) == "undefined" || audio_modulator == null) {
                document.getElementById("errorLoading").style.display = "block";
            }
        });
    });
}

function init(func) {
    document.getElementById("loading").style.display = "block";
    document.getElementById("errorLoading").style.display = "none";
    document.getElementById("checkAudioRetour").checked = false;
    document.getElementById("version").innerHTML = app_version;
    document.getElementById("appVersion").innerHTML = app_version;
    document.getElementById("appUpdateDate").innerHTML = app_version_date;
    initAudioAPI();

    preloadAudios(audioArray, function(result) {
        document.getElementById("loading").style.display = "none";
        document.getElementById("fileSelect").disabled = false;
        document.getElementById("fileRecord").disabled = false;
        setTooltip("fileRecord", "", false, true, "wrapperFileRecord", true);

        initAudioAPI();

        if(!'AudioContext' in window || audioContextNotSupported) {
            document.getElementById("compa").style.display = "block";
            document.getElementById("compaInfo").innerHTML = window.i18next.t("script.browserNotCompatible");
            document.getElementById("firstEtape").style.display = "block";
            document.getElementById("fileSelect").disabled = true;
            document.getElementById("fileRecord").disabled = true;
        }

        if(navigator.mediaDevices.getUserMedia == null) {
            setTooltip("fileRecord", window.i18next.t("script.browserNotCompatible"), true, false, "wrapperFileRecord", true);
        }

        if(typeof(Worker) !== "undefined" && Worker != null) {
            setTooltip("saveInputModify", "", false, true, "wrapperSave", true);
        } else {
            setTooltip("saveInputModify", window.i18next.t("script.browserNotCompatible"), true, false, "wrapperSave", true);
        }

        compaMode();

        if(typeof func !== 'undefined') {
            return func(true);
        } else {
            return true;
        }
    });
}

// When the page is entirely loaded, call the init function who load the others assets (images, sounds)
document.onreadystatechange = function() {
    if(document.readyState === 'complete') {
        init();
    }
};

window.onbeforeunload = function() {
    return window.i18next.t("script.appClosing");
};

// Updater
function checkUpdate() {
    var script = document.createElement("script");
    script.src = updater_uri;

    document.getElementsByTagName('head')[0].appendChild(script);
}

function updateCallback(data) {
    if(typeof(data) !== "undefined" && data !== null && typeof(data.version) !== "undefined" && data.version !== null) {
        var newVersionTest = app_version.strcmp(data.version);

        if(newVersionTest < 0) {
            document.getElementById("updateAvailable").style.display = "block";
            document.getElementById("appUpdateVersion").textContent = data.version;

            var appUpdateDate = app_version_date;

            if(typeof(data.date) !== "undefined" && data.date !== null) {
                var appUpdateDate = data.date;
            }

            document.getElementById("appUpdateDate").textContent = appUpdateDate;

            var downloadURL = "http://eliastiksofts.com/simple-voice-changer/downloads/index.php";

            if(typeof(data.url) !== "undefined" && data.url !== null) {
                var downloadURL = data.url;
            }

            document.getElementById("appDownloadLink").onclick = function() {
                window.open(downloadURL, '_blank');
            };

            document.getElementById("appDownloadURLGet").onclick = function() {
                prompt(window.i18next.t("update.URLToDownload"), downloadURL);
            };

            var changes = window.i18next.t("update.noChanges");

            if(typeof(data.changes) !== "undefined" && data.changes !== null) {
                var changes = data.changes;
            }

            document.getElementById("appUpdateChanges").onclick = function() {
                alert(window.i18next.t("update.changes") + "\n" + changes);
            };

            translateContent();
        }
    }
}

checkUpdate();

// Localization
function listTranslations(languages) {
    if(languages != null) {
      document.getElementById("languageSelect").disabled = true;
      document.getElementById("languageSelect").innerHTML = "";

      for(var i = 0; i < languages.length; i++) {
          document.getElementById("languageSelect").innerHTML = document.getElementById("languageSelect").innerHTML + '<option data-i18n="lang.' + languages[i] + '" value="'+ languages[i] +'"></option>';
      }

      document.getElementById("languageSelect").value = i18next.language.substr(0, 2);
      document.getElementById("languageSelect").disabled = false;
    }
}

function translateContent() {
    listTranslations(i18next.languages);

    var i18nList = document.querySelectorAll("[data-i18n]");
    i18nList.forEach(function(v) {
        v.innerHTML = window.i18next.t(v.dataset.i18n);
    });

    document.getElementById("versionDate").innerHTML = new Intl.DateTimeFormat(i18next.language).format(new Date(app_version_date));
    initAudioAPI();

    document.getElementById("appDownloadURLGet").title = window.i18next.t("update.getURL");
    document.getElementById("appUpdateChanges").title = window.i18next.t("update.getChanges");

    document.getElementById("appUpdateDateLocalized").innerHTML = window.i18next.t("update.versionDate", { date: new Intl.DateTimeFormat(i18next.language).format(new Date(document.getElementById("appUpdateDate").innerHTML)) });
}

document.getElementById("languageSelect").onchange = function() {
    i18next.changeLanguage(document.getElementById("languageSelect").value, function(err, t) {
        translateContent();
    });
};

window.addEventListener("load", function() {
    setTimeout(function() {
        translateContent();
    }, 250);
});

// Do you like ponies ?
