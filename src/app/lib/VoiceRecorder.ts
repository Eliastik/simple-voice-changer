
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
import TimerSaveTime from "./utils/TimerSaveTime";
import EventEmitter from "./utils/EventEmitter";
import { EventType } from "./model/EventTypeEnum";
import AudioConstraintWrapper from "./model/AudioConstraintWrapper";
import { RecorderSettings } from "./model/RecorderSettings";
import { ConfigService } from "./services/ConfigService";
import AbstractAudioElement from "./filters/interfaces/AbstractAudioElement";
import Constants from "./model/Constants";
import { EventEmitterCallback } from "./model/EventEmitterCallback";
import AudioConstraint from "./model/AudioConstraint";
import Recorder from "./recorder/Recorder";

export default class VoiceRecorder extends AbstractAudioElement {

    private context: AudioContext | null | undefined;
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
    private previousSampleRate = Constants.DEFAULT_SAMPLE_RATE;

    constructor(context?: AudioContext | null, eventEmitter?: EventEmitter, configService?: ConfigService) {
        super();
        this.context = context;
        this.eventEmitter = eventEmitter || new EventEmitter();
        this.configService = configService || null;

        if (this.configService) {
            this.previousSampleRate = this.configService.getSampleRate();
        }
    }

    /** Initialize this voice recorder */
    async init() {
        if (!this.isRecordingAvailable()) {
            return;
        }

        if (!this.context) {
            await this.createNewContext(this.previousSampleRate);
        } else {
            await this.createNewContextIfNeeded();
        }

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

    /**
     * Create new context if needed, for example if sample rate setting have changed
     */
    private async createNewContextIfNeeded() {
        let currentSampleRate = Constants.DEFAULT_SAMPLE_RATE;

        if (this.configService) {
            currentSampleRate = this.configService.getSampleRate();
        }

        // If sample rate setting has changed, create a new audio context
        if (currentSampleRate != this.previousSampleRate) {
            this.createNewContext(currentSampleRate);
        }
    }

    /** 
     * Stop previous audio context and create a new one
     */
    private async createNewContext(sampleRate: number) {
        if (this.context) {
            await this.context.close();
        }

        const options: AudioContextOptions = {
            latencyHint: "balanced"
        };

        if (sampleRate != 0) {
            options.sampleRate = sampleRate;
        }

        this.context = new AudioContext(options);
    }

    private successCallback() {
        this.eventEmitter?.emit(EventType.RECORDER_SUCCESS);
    }

    private errorCallback() {
        this.eventEmitter?.emit(EventType.RECORDER_ERROR);
    }

    /**
     * Enable or disable audio feedback
     * @param enable boolean
     */
    audioFeedback(enable: boolean) {
        if (this.context) {
            if (enable) {
                this.input && this.input.connect(this.context.destination);
                this.enableAudioFeedback = true;
            } else {
                this.input && this.input.connect(this.context.destination) && this.input.disconnect(this.context.destination);
                this.enableAudioFeedback = false;
            }

            this.eventEmitter?.emit(EventType.RECORDER_UPDATE_CONSTRAINTS);
        }
    }

    /**
     * Get current constraints/settings
     * @returns MediaTrackSettings
     */
    private getConstraints() {
        if (this.stream) {
            const tracks = this.stream.getTracks();

            if (tracks && tracks.length > 0) {
                return tracks[0].getSettings();
            }
        }

        return null;
    }

    /**
     * Update the current constraints
     */
    private updateConstraints() {
        const constraints = this.getConstraints();

        if (constraints) {
            this.constraints.audio = Object.assign(this.constraints.audio, constraints);
            this.eventEmitter?.emit(EventType.RECORDER_UPDATE_CONSTRAINTS);
        }
    }

    /**
     * Reset the current constraints
     * @param newConstraint AudioConstraintWrapper
     */
    private async resetConstraints(newConstraint?: AudioConstraintWrapper) {
        if (this.stream) {
            const precAudioFeedback = this.enableAudioFeedback;
            const precRecording = this.recording;
            const tracks = this.stream.getTracks();

            if (newConstraint) {
                this.updateConstraints();
                this.constraints.audio = Object.assign(this.constraints.audio, newConstraint.audio);
            }

            if (tracks && tracks.length > 0) {
                try {
                    await tracks[0].applyConstraints(this.constraints.audio);

                    const newConstraints = this.getConstraints();
                    const newConstraintName = newConstraint ? Object.keys(newConstraint.audio)[0] : "";

                    this.audioFeedback(false);
                    this.pause();

                    if (!newConstraint ||
                        (newConstraints && (newConstraints as AudioConstraint)[newConstraintName] != newConstraint.audio[newConstraintName])) {
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

    /**
     * Setup this voice recorder
     * @param stream MediaStream
     * @param precRecording Was recording?
     * @param precAudioFeedback Has audio feedback?
     */
    private async setup(stream: MediaStream | null, precRecording: boolean, precAudioFeedback: boolean) {
        if (stream && this.context) {
            this.input = this.context.createMediaStreamSource(stream);
            this.stream = stream;
        }

        if (this.recorder && this.input) {
            this.recorder.setup(this.input);

            if (precRecording) {
                await this.record();
            }
        }

        this.audioFeedback(precAudioFeedback);
        this.updateConstraints();
        await this.updateInputList();
    }

    /**
     * Enable/disable noise suppression
     * @param enable boolean
     */
    setNoiseSuppression(enable: boolean) {
        this.resetConstraints({
            audio: {
                noiseSuppression: enable
            }
        });
    }

    /**
     * Enable/disable auto gain
     * @param enable boolean
     */
    setAutoGain(enable: boolean) {
        this.resetConstraints({
            audio: {
                autoGainControl: enable
            }
        });
    }

    /**
     * Enable/disable echo cancellation
     * @param enable boolean
     */
    setEchoCancellation(enable: boolean) {
        this.resetConstraints({
            audio: {
                echoCancellation: enable
            }
        });
    }

    /**
     * Update current audio input list
     */
    private async updateInputList() {
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

    /**
     * Change audio input
     * @param deviceId Device ID
     * @param groupId Group ID (optional)
     */
    changeInput(deviceId: string, groupId: string | undefined) {
        if (groupId) {
            this.constraints.audio.deviceId = deviceId;
            this.constraints.audio.groupId = groupId;
            this.resetConstraints();
        }
    }

    /**
     * Start audio recording
     */
    async record() {
        if (this.alreadyInit && this.configService && this.input) {
            if (!this.recorder) {
                this.recorder = new Recorder({
                    bufferLen: this.configService.getBufferSize(),
                    sampleRate: this.configService.getSampleRate(),
                    numChannels: 2,
                    mimeType: "audio/wav"
                });
            }

            if (this.recorder) {
                await this.recorder.setup(this.input);
                this.recorder.record();
            }

            this.timer && this.timer.start();
            this.recording = true;

            if (this.eventEmitter) {
                this.eventEmitter.emit(EventType.RECORDER_RECORDING);
            }
        }
    }

    /**
     * Stop audio recording
     */
    async stop() {
        if (this.alreadyInit && this.recorder) {
            this.recorder.stop();
            this.timer && this.timer.stop();
            this.recording = false;

            this.recorder.getBuffer((buffer: Float32Array[]) => {
                if (this.context) {
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

    /**
     * Pause audio recording
     */
    pause() {
        if (this.alreadyInit) {
            this.recorder && this.recorder.stop();
            this.timer && this.timer.stop();
            this.recording = false;
            this.eventEmitter?.emit(EventType.RECORDER_PAUSED);
        }
    }

    /**
     * Stop stream
     */
    private stopStream() {
        if (this.stream) {
            const tracks = this.stream.getTracks();

            for (let i = 0, l = tracks.length; i < l; i++) {
                tracks[i].stop();
            }
        }
    }

    /**
     * Reset this voice recorder
     */
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

    /**
     * Get current recording time in text format
     */
    get currentTimeDisplay() {
        return this.timer?.seconds ? ("0" + Math.trunc(this.timer?.seconds / 60)).slice(-2) + ":" + ("0" + Math.trunc(this.timer?.seconds % 60)).slice(-2) : "00:00";
    }

    /**
     * Get current recording time in seconds
     */
    get currentTime() {
        return this.timer ? this.timer.seconds : 0;
    }

    /**
     * Get the current settings for this voice recorder
     * @returns RecorderSettings
     */
    getSettings(): RecorderSettings {
        return {
            deviceList: this.deviceList,
            audioFeedback: this.enableAudioFeedback,
            constraints: this.constraints.audio
        };
    }

    /**
     * Observe an event
     * @param event The event name
     * @param callback Callback called when an event of this type occurs
     */
    on(event: string, callback: EventEmitterCallback) {
        this.eventEmitter?.on(event, callback);
    }

    /**
     * Check if browser is compatible with audio recording
     * @returns boolean
     */
    isRecordingAvailable() {
        return typeof (navigator.mediaDevices) !== "undefined" && typeof (navigator.mediaDevices.getUserMedia) !== "undefined";
    }

    get order(): number {
        return -1;
    }

    get id(): string {
        throw Constants.VOICE_RECORDER;
    }
}
