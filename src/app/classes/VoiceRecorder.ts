
/*
 * Copyright (C) 2019-2023 Eliastik (eliastiksofts.com)
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
//@ts-ignore
import { Recorder } from "recorderjs";
import TimerSaveTime from "./TimerSaveTime";
import EventEmitter from "./EventEmitter";
import { EventType } from "./model/EventTypeEnum";
import AudioConstraintWrapper from "./model/AudioConstraintWrapper";
import { RecorderSettings } from "./model/RecorderSettings";

export default class VoiceRecorder {
    private context: AudioContext | null = null;
    private input: MediaStreamAudioSourceNode | null = null;
    private stream: MediaStream | null = null;
    private recorder: Recorder | null = null;
    private alreadyInit = false;
    private timer: TimerSaveTime | null = null;
    private enableAudioFeedback = false;
    private recording = false;
    private deviceList: MediaDeviceInfo[] = [];
    private constraints: AudioConstraintWrapper = {
        audio: {
            noiseSuppression: true,
            echoCancellation: true,
            autoGainControl: true
        }
    };
    private eventEmitter: EventEmitter | null = null;

    constructor(context: AudioContext, eventEmitter?: EventEmitter) {
        this.context = context;
        this.eventEmitter = eventEmitter || new EventEmitter();;
    }

    async init() {
        this.eventEmitter?.emit(EventType.RECORDER_INIT);

        try {
            const stream = await navigator.mediaDevices.getUserMedia(this.constraints);

            if (this.context) {
                this.context.resume();
            }

            await this.setup(stream, false, false);

            this.alreadyInit = true;
            this.timer = new TimerSaveTime(0, 1);

            this.timer.onCount(() => {
                this.eventEmitter?.emit(EventType.RECORDER_COUNT_UPDATE);
            });

            this.successCallback();
        } catch (e) {
            this.errorCallback();
        }

        navigator.mediaDevices.ondevicechange = () => this.updateInputList();
    }

    successCallback() {
        this.eventEmitter?.emit(EventType.RECORDER_SUCCESS);
    }

    errorCallback() {
        this.eventEmitter?.emit(EventType.RECORDER_ERROR);
    }

    audioFeedback(enable: boolean) {
        if (this.context) {
            if (enable) {
                this.input && this.input.connect(this.context.destination);
                this.enableAudioFeedback = true;
            } else {
                this.input && this.input.connect(this.context.destination) && this.input.disconnect(this.context.destination);
                this.enableAudioFeedback = false;
            }
        }
    }

    getConstraints() {
        if (this.stream) {
            const tracks = this.stream.getTracks();

            if (tracks && tracks.length > 0) {
                return tracks[0].getSettings();
            }
        }

        return null;
    }

    updateConstraints() {
        const constraints = this.getConstraints();

        if (constraints) {
            this.constraints.audio = Object.assign(this.constraints.audio, constraints);
            this.eventEmitter?.emit(EventType.RECORDER_UPDATE_CONSTRAINTS);
        }
    }

    async resetConstraints(newConstraint?: AudioConstraintWrapper) {
        if (this.stream) {
            const precAudioFeedback = this.enableAudioFeedback;
            const precRecording = this.recording;
            const tracks = this.stream.getTracks();

            if (newConstraint) {
                this.updateConstraints();
                this.constraints.audio = Object.assign(this.constraints.audio, newConstraint);
            }

            if (tracks && tracks.length > 0) {
                try {
                    await tracks[0].applyConstraints(this.constraints.audio);

                    const newConstraints = this.getConstraints();
                    const newConstraintName = newConstraint ? Object.keys(newConstraint.audio)[0] : "";

                    this.audioFeedback(false);
                    this.pause();

                    if (!newConstraint ||
                        (newConstraints && (newConstraints as any)[newConstraintName] != (newConstraint.audio as any)[newConstraintName])) {
                        this.stopStream();

                        const stream = await navigator.mediaDevices.getUserMedia(this.constraints);

                        await this.setup(stream, precRecording, precAudioFeedback);
                        this.successCallback();
                    } else {
                        await this.setup(null, precRecording, precAudioFeedback);
                    }
                } catch (e) {
                    this.errorCallback();
                }
            }
        }
    }

    async setup(stream: MediaStream | null, precRecording: boolean, precAudioFeedback: boolean) {
        if (stream && this.context) {
            this.input = this.context.createMediaStreamSource(stream);
            this.stream = stream;
        }

        if (this.recorder) {
            this.recorder.setup(this.input);

            if (precRecording) {
                this.record();
            }
        }

        this.audioFeedback(precAudioFeedback);
        this.updateConstraints();
        await this.updateInputList();
    }

    setNoiseSuppression(enable: boolean) {
        this.resetConstraints({
            audio: {
                noiseSuppression: enable
            }
        });
    }

    setAutoGain(enable: boolean) {
        this.resetConstraints({
            audio: {
                autoGainControl: enable
            }
        });
    }

    setEchoCancellation(enable: boolean) {
        this.resetConstraints({
            audio: {
                echoCancellation: enable
            }
        });
    }

    async updateInputList() {
        if (this.deviceList) {
            const devices = await navigator.mediaDevices.enumerateDevices();
            this.deviceList = [];

            devices.forEach(device => {
                if (device.kind == "audioinput") {
                    this.deviceList.push(device);
                }
            });
        }
    }

    changeInput(deviceId: string, groupId: string | undefined) {
        if(groupId) {
            this.constraints.audio.deviceId = deviceId;
            this.constraints.audio.groupId = groupId;
            this.resetConstraints();
        }
    }

    record() {
        if (this.alreadyInit) {
            if (!this.recorder) this.recorder = new Recorder(this.input);
            this.recorder && this.recorder.record();
            this.timer && this.timer.start();
            this.recording = true;
            this.eventEmitter?.emit(EventType.RECORDER_RECORDING);
        }
    }

    async stop() {
        if (this.alreadyInit && this.recorder) {
            this.recorder.stop();
            this.timer && this.timer.stop();
            this.recording = false;

            this.recorder.getBuffer((buffer: Float32Array[]) => {
                if(this.context) {
                    this.context.resume();
    
                    const newBuffer = this.context.createBuffer(2, buffer[0].length, this.context.sampleRate);
                    newBuffer.getChannelData(0).set(buffer[0]);
                    newBuffer.getChannelData(1).set(buffer[1]);
    
                    this.eventEmitter?.emit(EventType.RECORDER_STOPPED, newBuffer);
                    this.reset();
                }
            });
        }
    }

    pause() {
        if (this.alreadyInit) {
            this.recorder && this.recorder.stop();
            this.timer && this.timer.stop();
            this.recording = false;
            this.eventEmitter?.emit(EventType.RECORDER_PAUSED);
        }
    }

    stopStream() {
        if (this.stream) {
            const tracks = this.stream.getTracks();

            for (let i = 0, l = tracks.length; i < l; i++) {
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

        this.eventEmitter?.emit(EventType.RECORDER_RESETED);
    }

    get currentTimeDisplay() {
        return this.timer?.seconds ? ("0" + Math.trunc(this.timer?.seconds / 60)).slice(-2) + ":" + ("0" + Math.trunc(this.timer?.seconds % 60)).slice(-2) : "00:00";
    }

    get currentTime() {
        return this.timer ? this.timer.seconds : 0;
    }

    getSettings(): RecorderSettings {
        return {
            deviceList: this.deviceList,
            audioFeedback: this.enableAudioFeedback,
            constraints: this.constraints.audio
        };
    }

    on(event: string, callback: Function) {
        this.eventEmitter?.on(event, callback);
    }
}