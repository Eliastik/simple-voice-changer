
/*
 * Copyright (C) 2019-2020 Eliastik (eliastiksofts.com)
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
// The Voice Recorder class
// Used to record a sound (voice, etc.) with the user microphone
// Offer control with play/pause and audio feedback
import { Recorder } from "recorderjs";
import TimerSaveTime from "./TimerSaveTime";

export default class VoiceRecorder {
    constructor(context) {
        this.context = context;
        this.input;
        this.stream;
        this.recorder;
        this.alreadyInit;
        this.timer;
        this.enableAudioFeedback = false;
        this.recording = false;
        this.deviceList;
        this.constraints = {
            audio: {
                noiseSuppression: true,
                echoCancellation: true,
                autoGainControl: true
            }
        };
        // Events
        this.onSuccess;
        this.onError;
        this.onInit;
        this.onRecord;
        this.onPause;
        this.onReset;
        this.onUpdateConstraints;
        this.onStop;
    }

    init() {
        if(this.onInit) this.onInit();

        navigator.mediaDevices.getUserMedia(this.constraints).then(stream => {
            this.context.resume();
            this.setup(stream, false, false);
            this.alreadyInit = true;
            this.timer = new TimerSaveTime("timeRecord", null, 0, 1);
            this.successCallback();
        }).catch(this.errorCallback);

        navigator.mediaDevices.ondevicechange = () => this.updateInputList();
    }

    successCallback() {
        if(this.onSuccess) this.onSuccess();
    }

    errorCallback(e) {
        if(this.onError) this.onError(e);
    }

    audioFeedback(enable) {
        if(enable) {
            this.input && this.input.connect(this.context.destination);
            this.enableAudioFeedback = true;
        } else {
            this.input && this.input.connect(this.context.destination) && this.input.disconnect(this.context.destination);
            this.enableAudioFeedback = false;
        }
    }

    getConstraints() {
        if(this.stream) {
            var tracks = this.stream.getTracks();
    
            if(tracks && tracks.length > 0) {
                return tracks[0].getSettings();
            }
        }

        return null;
    }

    updateConstraints() {
        var constraints = this.getConstraints();

        if(constraints) {
            this.constraints.audio = Object.assign(this.constraints.audio, constraints);
            if(this.onUpdateConstraints) this.onUpdateConstraints();
        }
    }

    resetConstraints(newConstraint) {
        var precAudioFeedback = this.enableAudioFeedback;
        var precRecording = this.recording;
        var tracks = this.stream.getTracks();

        if(newConstraint) {
            this.updateConstraints();
            this.constraints.audio = Object.assign(this.constraints.audio, newConstraint);
        }

        if(tracks && tracks.length > 0) {
            tracks[0].applyConstraints(this.constraints).then(() => {
                var newConstraints = this.getConstraints();
                var newConstraintName = newConstraint ? Object.keys(newConstraint)[0] : "";

                this.audioFeedback(false);
                this.pause();

                if(!newConstraint || newConstraints[newConstraintName] != newConstraint[newConstraintName]) {
                    this.stopStream();

                    navigator.mediaDevices.getUserMedia(this.constraints).then(stream => {
                        this.setup(stream, precRecording, precAudioFeedback);
                        this.successCallback();
                    }).catch(this.errorCallback);
                } else {
                    this.setup(null, precRecording, precAudioFeedback);
                }
            }).catch(this.errorCallback);
        }
    }

    setup(stream, precRecording, precAudioFeedback) {
        if(stream) {
            this.input = this.context.createMediaStreamSource(stream);
            this.stream = stream;
        }

        if(this.recorder) {
            this.recorder.setup(this.input);

            if(precRecording) {
                this.record();
            }
        }

        this.audioFeedback(precAudioFeedback);
        this.updateConstraints();
        this.updateInputList();
    }

    setNoiseSuppression(enable) {
        this.resetConstraints({ "noiseSuppression": enable });
    }

    setAutoGain(enable) {
        this.resetConstraints({ "autoGainControl": enable });
    }

    setEchoCancellation(enable) {
        this.resetConstraints({ "echoCancellation": enable });
    }

    updateInputList() {
        if(this.deviceList) {
            navigator.mediaDevices.enumerateDevices().then(devices => {
                this.deviceList.textContent = "";
    
                devices.forEach(device => {
                    if(device.kind == "audioinput") {
                        var option = document.createElement("option");
                        option.value = device.deviceId
                        option.dataset.groupId = device.groupId
                        option.text = device.label;
                        this.deviceList.appendChild(option);
                    }
                });
    
                this.deviceList.value = this.constraints.audio.deviceId;
            });
        }
    }

    changeInput(deviceId, groupId) {
        this.constraints.audio.deviceId = deviceId;
        this.constraints.audio.groupId = groupId;
        this.resetConstraints();
    }

    record() {
        if(this.alreadyInit) {
            if(!this.recorder) this.recorder = new Recorder(this.input, { workerPath: "src/recorderWorker.js" });
            this.recorder && this.recorder.record();
            this.timer && this.timer.start();
            this.recording = true;
            if(this.onRecord) this.onRecord();
        }
    }

    stop() {
        if(this.alreadyInit) {
            this.recorder && this.recorder.stop();
            this.timer && this.timer.stop();
            this.recording = false;

            this.recorder.getBuffer(buffer => {
                this.context.resume();
                var newSource = this.context.createBufferSource();
                var newBuffer = this.context.createBuffer(2, buffer[0].length, this.context.sampleRate);
                newBuffer.getChannelData(0).set(buffer[0]);
                newBuffer.getChannelData(1).set(buffer[1]);
                newSource.buffer = newBuffer;

                if(this.onStop) this.onStop(newBuffer);
                this.reset();
            });
        }
    }

    pause() {
        if(this.alreadyInit) {
            this.recorder && this.recorder.stop();
            this.timer && this.timer.stop();
            this.recording = false;
            if(this.onPause) this.onPause();
        }
    }

    stopStream() {
        if(this.stream && this.stream.stop) {
            this.stream.stop();
        } else if(this.stream) {
            var tracks = this.stream.getTracks();

            for(var i = 0, l = tracks.length; i < l; i++) {
                tracks[i].stop();
            }
        }
    }

    reset() {
        this.recorder && this.recorder.stop();
        this.recorder && this.recorder.clear();
        this.timer && this.timer.stop();
        this.audioFeedback(false);

        this.stopStream();

        this.input = null;
        this.recorder = null;
        this.stream = null;
        this.alreadyInit = false;
        this.timer = null;

        if(this.onReset) this.onReset();
    }
}