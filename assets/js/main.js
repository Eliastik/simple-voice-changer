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
var speedAudio, pitchAudio, modifyFirstClick, reverbAudio, compaAudioAPI, vocoderAudio, compatModeChecked, audioContextNotSupported, audioProcessing, removedTooltipInfo, audio_principal_buffer, audio_impulse_response, audio_modulator, audioBufferPlay;

speedAudio = pitchAudio = 1;
reverbAudio = compaAudioAPI = vocoderAudio = compatModeChecked = audioContextNotSupported = audioProcessing = removedTooltipInfo = false;
audio_principal_buffer = audio_impulse_response = audio_modulator = null;

// Settings
var filesDownloadName = "simple_voice_changer";
var audioArray = ["assets/sounds/impulse_response.mp3", "assets/sounds/modulator.mp3"]; // audio to be loaded when launching the app
// End of the settings

if('AudioContext' in window) {
    try {
        var AudioContext = window.AudioContext || window.webkitAudioContext;
        var context = new AudioContext();
    } catch(e) {
        if(typeof(window.console.error) !== 'undefined') {
            console.error("Error when creating Audio Context (the Web Audio API seem to be unsupported):", e);
        } else {
            console.log("Error when creating Audio Context (the Web Audio API seem to be unsupported):", e);
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
        if(document.getElementById("checkCompa").checked == true) {
            setTooltip("stopAudio", "Non disponible en mode de compatibilité.", true, false, "wrapperStop", true);
        } else {
            setTooltip("stopAudio", null, false, true, "wrapperStop", true);
        }

        if (typeof(Worker) !== "undefined" && Worker != null) {
            setTooltip("saveInputModify", null, false, true, "wrapperSave", true);
        } else {
            setTooltip("saveInputModify", "Désolé, cette fonction est incompatible avec votre navigateur.", true, false, "wrapperSave", true);
        }
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

        for (var channel = 0; channel < audio_principal_buffer.numberOfChannels; channel++) {
            var nowBuffering = audio_principal_buffer.getChannelData(channel);

            for (var i = 0; i < buffer.length; i++) {
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

function renderAudioAPI(audio, speed, pitch, reverb, save, play, audioName, comp, vocode, rate, BUFFER_SIZE) {
    // Default parameters
    var speed = speed || 1; // Speed of the audio
    var pitch = pitch || 1; // Pitch of the audio
    var reverb = reverb || false; // Enable or disable reverb
    var save = save || false; // Save the audio buffer under a wav file
    var play = play || false; // Play the audio
    var audioName = audioName || "sample"; // The audio buffer variable name (global)
    var comp = comp || false; // Enable or disable the compatibility mode
    var vocode = vocode || false; // Enable or disable vocoder
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
            var st = new soundtouch.SoundTouch(44100);
            st.pitch = pitch;
            st.tempo = speed;
            st.rate = rate;
            var filter = new soundtouch.SimpleFilter(new soundtouch.WebAudioBufferSource(buffer), st);
            var node = soundtouch.getWebAudioNode(offlineContext, filter);

            if(!comp) {
                if(reverb) {
                    convolver.buffer = audio_impulse_response;
                    node.connect(convolver);
                    convolver.connect(offlineContext.destination);
                } else {
                    node.connect(offlineContext.destination);
                }

                offlineContext.oncomplete = function(e) {
                    window[audioName] = e.renderedBuffer;

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
                }

                if(reverb) {
                    convolver.buffer = audio_impulse_response;
                    node.connect(convolver);

                    if(play) {
                        convolver.connect(offlineContext.destination);

                         if(save) {
                            var rec = new Recorder(convolver, { workerPath: "assets/js/recorderWorker.js" });
                        }
                    }
                } else {
                    if(play) {
                        node.connect(offlineContext.destination);

                         if(save) {
                            var rec = new Recorder(node, { workerPath: "assets/js/recorderWorker.js" });
                        }
                    }
                }

                if(play && save) {
                    var timer = new timerSaveTime("timeFinishedDownload", Math.round(durationAudio), -1);
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
                            document.getElementById("processingSave").style.display = "none";
                            audioProcessing = false;
                            compaMode();
                        });
                    }, durationAudio * 1000);
                }
            }
        }

        if(reverb) var convolver = offlineContext.createConvolver();

        if(vocode) {
            var offlineContext2 = new OfflineAudioContext(2, context.sampleRate * durationAudio, context.sampleRate);

            if(comp) document.getElementById("playAudio").disabled = true;

            offlineContext2.oncomplete = function(e) {
                renderAudio(e.renderedBuffer);
                if(comp) document.getElementById("playAudio").disabled = false;
            };

            vocoder(offlineContext2, audio_modulator, audio);
            offlineContext2.startRendering();
        } else {
            renderAudio(audio);
        }
    } else {
        if(typeof(window.console.error) !== 'undefined') console.error("Web Audio API not supported by this browser.");
        return false;
    }
}

function playBufferAudioAPI(audio) {
    this.buffer = audio;
    this.source;
    this.interval;

    this.init = function() {
        context.resume();
        this.source = context.createBufferSource();
        this.source.buffer = audio;
        this.source.connect(context.destination);
    };

    this.stop = function() {
        this.source.stop(0);
    };

    this.start = function() {
        this.source.start(0);
    };
}

function saveBuffer(buffer) {
    if(typeof(Worker) !== "undefined" && Worker != null) {
        var worker = new Worker("assets/js/recorderWorker.js");
    } else {
        if(typeof(window.console.error) !== 'undefined') console.error("Workers are not supported by this browser.");
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
        if(typeof(window.console.error) !== 'undefined') console.error("Web Audio API not supported by this browser.");
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
        alert("Une erreur est survenue.");
        return false;
    }

    if(isNaN(tmp_pitch) || tmp_pitch == "" || tmp_pitch <= 0 || tmp_pitch > 5) {
        alert("Valeur du pitch invalide !");
        document.getElementById("pitchRange").value = pitchAudio;
        document.getElementById("speedRange").value = speedAudio;
        return false;
    } else if(isNaN(tmp_speed) || tmp_speed == "" || tmp_speed <= 0 || tmp_speed > 5) {
        alert("Valeur de la vitesse invalide !");
        document.getElementById("pitchRange").value = pitchAudio;
        document.getElementById("speedRange").value = speedAudio;
        return false;
    } else {
        pitchAudio = tmp_pitch;
        speedAudio = tmp_speed;
        if(document.getElementById("checkReverb").checked == true) reverbAudio = true; else reverbAudio = false;
        if(document.getElementById("checkCompa").checked == true) compaAudioAPI = true; else compaAudioAPI = false;
        if(document.getElementById("checkVocode").checked == true) vocoderAudio = true; else vocoderAudio = false;

        if(compaAudioAPI) {
            if(checkAudio !== true || play !== true) {
                document.getElementById("validInputModify").disabled = false;
            }

            if(play) {
                launchPlay();
            }
        } else {
            renderAudioAPI(audio_principal_buffer, speedAudio, pitchAudio, reverbAudio, save, play, "audio_principal_processed", compaAudioAPI, vocoderAudio);
        }

        return true;
    }

    return false;
}

function launchPlay() {
    if(typeof(audio_principal_processed) !== "undefined" && audio_principal_processed != null && !compaAudioAPI) {
        launchStop();
        audioBufferPlay = new playBufferAudioAPI(audio_principal_processed);
        audioBufferPlay.init();
        audioBufferPlay.start();
    } else if(compaAudioAPI) {
        renderAudioAPI(audio_principal_buffer, speedAudio, pitchAudio, reverbAudio, false, true, "audio_principal_processed", compaAudioAPI, vocoderAudio);
    }
}

function launchStop() {
    if(typeof(audioBufferPlay) !== "undefined" && audioBufferPlay != null && !compaAudioAPI) audioBufferPlay.stop();
}

function launchSave() {
    if(!audioProcessing && typeof(audio_principal_processed) !== "undefined" && audio_principal_processed != null && !compaAudioAPI) {
        saveBuffer(audio_principal_processed);
    } else if(compaAudioAPI) {
        renderAudioAPI(audio_principal_buffer, speedAudio, pitchAudio, reverbAudio, true, true, "audio_principal_processed", compaAudioAPI, vocoderAudio);
    }
}

function launchReset() {
    if(!audioProcessing && confirm("Vos modifications non enregistrées seront perdues. Êtes-vous sûr de vouloir choisir un autre fichier ou enregistrement ?")) {
        document.getElementById("firstEtape").style.display = "block";
        document.getElementById("secondEtape").style.display = "none";
        document.getElementById("thirdEtape").style.display = "none";
        document.getElementById("lastEtape").style.display = "none";
        document.getElementById("firstEtapeBis").style.display = "none";
        document.getElementById("inputFile").value = "";
        document.getElementById("checkReverb").checked = false;
        document.getElementById("checkVocode").checked = false;
        slider.setValue(1.0);
        slider2.setValue(1.0);
        launchStop();
        recorderVoice.reset();
    }
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

        navigator.getUserMedia({audio: true}, function(stream) {
            context.resume();
            self.input = context.createMediaStreamSource(stream);
            self.stream = stream;
            self.recorder = new Recorder(self.input, { workerPath: "assets/js/recorderWorker.js" });
            self.alreadyInit = true;
            self.timer = new timerSaveTime("timeRecord", 0, 1);
            document.getElementById("errorRecord").style.display = "none";
            document.getElementById("waitRecord").style.display = "none";
            document.getElementById("recordAudioPlay").disabled = false;
            document.getElementById("checkAudioRetour").disabled = false;
            document.getElementById("checkAudioRetourGroup").setAttribute("class", "checkbox");
        }, function(e) {
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

function timerSaveTime(id, seconds, incr) {
    this.id = id;
    this.seconds = seconds;
    this.interval;
    this.incr = incr;

    this.start = function() {
        document.getElementById(id).innerHTML = ("0" + Math.trunc(this.seconds / 60)).slice(-2) + ":" + ("0" + Math.trunc(this.seconds % 60)).slice(-2);

        var self = this;

        this.interval = setInterval(function() {
            self.count();
        }, 1000);
    };

    this.stop = function() {
        clearInterval(this.interval);
    };

    this.count = function() {
        this.seconds += this.incr;

        if(document.getElementById(id) != null) document.getElementById(id).innerHTML = ("0" + Math.trunc(this.seconds / 60)).slice(-2) + ":" + ("0" + Math.trunc(this.seconds % 60)).slice(-2);

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
    var msgLoading = "Chargement des données audio : ";

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
        if(typeof(window.console.error) !== 'undefined') console.error("Web Audio API is not supported by this browser.");

        if(typeof func !== 'undefined') {
            return func(false);
        } else {
            return false;
        }
    }
}

function checkAudioBuffer(bufferName) {
    var errorText = "Une erreur est survenue lors du chargement de certaines données. Cette fonctionnalité est donc indisponible. Essayez de recharger la page (F5).";

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

    preloadAudios(audioArray, function(result) {
        document.getElementById("loading").style.display = "none";
        document.getElementById("fileSelect").disabled = false;
        document.getElementById("fileRecord").disabled = false;
        setTooltip("fileRecord", "", false, true, "wrapperFileRecord", true);

        initAudioAPI();

        if(!'AudioContext' in window || audioContextNotSupported) {
            document.getElementById("compa").style.display = "block";
            document.getElementById("compaInfo").innerHTML = "Désolé, votre navigateur n'est pas compatible avec cette application. Mettez-le à jour, puis réessayez.";
            document.getElementById("firstEtape").style.display = "block";
            document.getElementById("fileSelect").disabled = true;
            document.getElementById("fileRecord").disabled = true;
        }

        if(navigator.getUserMedia == null) {
            setTooltip("fileRecord", "Désolé, cette fonction est incompatible avec votre navigateur. Mettez-le à jour, puis réessayez.", true, false, "wrapperFileRecord", true);
        }

        if(typeof(Worker) !== "undefined" && Worker != null) {
            setTooltip("saveInputModify", "", false, true, "wrapperSave", true);
        } else {
            setTooltip("saveInputModify", "Désolé, cette fonction est incompatible avec votre navigateur. Mettez-le à jour, puis réessayez.", true, false, "wrapperSave", true);
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
    if (document.readyState === 'complete') {
        init();
    }
};

window.onbeforeunload = function() {
    return "Si vous fermez cette page, vous perdrez définitivement toutes vos modifications. Êtes-vous sûr de vouloir quitter cette page ?";
};

// Do you like ponies ?
