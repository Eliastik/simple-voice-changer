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
// The audio buffer player
// Used to play the audio buffer, with time controls, pause/play, stop and loop

import EventEmitter from "./utils/EventEmitter";
import AbstractAudioElement from "./filters/interfaces/AbstractAudioElement";
import { ConfigService } from "./services/ConfigService";
import Constants from "./model/Constants";
import { EventType } from "./model/EventTypeEnum";
import { EventEmitterCallback } from "./model/EventEmitterCallback";

// Also used in compatibility mode (which doesn't use audio buffer) with less functions (no time control)
export default class BufferPlayer extends AbstractAudioElement {

    private context: AudioContext | OfflineAudioContext | null = null;
    private buffer: AudioBuffer | null = null;
    private source: AudioBufferSourceNode | null = null;
    currentTime = 0;
    displayTime = 0;
    duration = 0;
    private interval: number | null = null;
    playing = false;
    loop = false;
    speedAudio = 1;
    private eventEmitter: EventEmitter | null;
    private onBeforePlayingCallback: () => void = async () => {};

    compatibilityMode = false;
    currentNode: AudioNode | null = null;

    constructor(context: AudioContext | OfflineAudioContext | null, eventEmitter?: EventEmitter, configService?: ConfigService) {
        super();
        this.context = context;
        this.eventEmitter = eventEmitter || new EventEmitter();
        this.configService = configService || null;
    }

    /** Init this buffer player */
    init() {
        this.playing = false;

        if (this.context) {
            this.context.resume();

            if (!this.compatibilityMode && this.buffer) {
                if (this.source != null) this.source.disconnect();
                this.source = this.context.createBufferSource();
                this.source.buffer = this.buffer;
                this.duration = this.buffer.duration * this.speedAudio;
                this.source.connect(this.context.destination);
            }
        }

        this.updateInfos();
    }

    /**
     * Load an audio buffer
     * @param buffer The buffer
     */
    loadBuffer(buffer: AudioBuffer) {
        this.compatibilityMode = false;
        this.reset();
        this.buffer = buffer;
        this.init();
    }

    /**
     * Enable compatibility mode
     * @param currentNode Current audio node to read
     * @param duration The audio duration
     */
    setCompatibilityMode(currentNode: AudioNode, duration?: number) {
        this.compatibilityMode = true;
        this.reset();
        this.init();

        if (duration != null) {
            this.duration = duration * this.speedAudio;
        }

        this.currentNode = currentNode;
        this.updateInfos();
    }

    /**
     * Reset this player
     */
    reset() {
        clearInterval(this.interval!);
        this.currentTime = 0;
        this.displayTime = 0;
        this.stop();
    }

    /**
     * Stop playing the audio
     */
    stop() {
        clearInterval(this.interval!);

        if (this.source != undefined && this.source != null && this.playing) {
            this.source.stop(0);
            this.playing = false;
        }

        if (this.currentNode) {
            this.currentNode.disconnect();

            if(this.compatibilityMode) {
                this.currentTime = 0;
                this.displayTime = 0;
            }
        }

        this.eventEmitter?.emit(EventType.PLAYING_STOPPED);
        this.updateInfos();
    }

    /**
     * Start playing the audio
     */
    async start() {
        if (this.source || this.compatibilityMode) {
            this.stop();
            this.init();

            await this.onBeforePlayingCallback();

            this.eventEmitter?.emit(EventType.PLAYING_STARTED);

            if (!this.compatibilityMode) {
                if (this.source) {
                    this.source.start(0, this.currentTime / this.speedAudio);
                    this.playing = true;
                } else {
                    return;
                }
            } else {
                if (this.currentNode && this.context) {
                    this.currentNode.connect(this.context.destination);
                } else {
                    return;
                }
            }

            let startTime = performance.now();

            this.interval = window.setInterval(() => {
                const timeNow = performance.now();
                const nextTime = timeNow - startTime;
                startTime = timeNow;

                this.currentTime += (nextTime / 1000) * this.speedAudio;
                this.displayTime = this.currentTime;

                if (this.currentTime > this.duration) {
                    if (this.loop) {
                        if (!this.compatibilityMode) {
                            this.reset();
                            this.start();
                        } else {
                            this.eventEmitter?.emit(EventType.PLAYING_FINISHED);
                        }
                    } else {
                        this.eventEmitter?.emit(EventType.PLAYING_FINISHED);
                        this.reset();
                    }
                } else {
                    this.updateInfos();
                }
            }, 100);
        }
    }

    /**
     * Pause the audio
     */
    pause() {
        this.stop();
    }

    /** Send an event to update the informations of this player */
    private updateInfos() {
        this.eventEmitter?.emit(EventType.PLAYING_UPDATE);
    }

    /**
     * Set the current starting time of this player
     * @param percent Where to start playing, in percent
     */
    setTimePercent(percent: number) {
        if(!this.compatibilityMode) {
            this.currentTime = Math.round(this.duration * (percent / 100));
            this.displayTime = this.currentTime;
    
            if (this.playing) {
                this.pause();
                this.start();
            } else {
                this.updateInfos();
            }
        }
    }

    /**
     * Set the current starting time of this player
     * @param time Where to start playing, in milliseconds
     */
    setTime(time: number) {
        if (!this.compatibilityMode) {
            this.currentTime = time;
            this.displayTime = this.currentTime;

            if (this.playing) {
                this.pause();
                this.start();
            } else {
                this.updateInfos();
            }
        }
    }

    /**
     * Callback called just before starting playing the audio
     * @param callback The callback
     */
    onBeforePlaying(callback: () => void) {
        this.onBeforePlayingCallback = callback;
    }

    /**
     * Enable/disable loop playing
     */
    toggleLoop() {
        this.loop = !this.loop;
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
     * Set a new audio context
     * @param context The new audio context
     */
    updateContext(context: AudioContext) {
        this.context = context;
    }

    /**
     * Get the time in text format
     */
    get currentTimeDisplay() {
        return ("0" + Math.trunc(this.displayTime / 60)).slice(-2) + ":" + ("0" + Math.trunc(this.displayTime % 60)).slice(-2);
    }

    /** 
     * Get the audio duration in text format
     */
    get maxTimeDisplay() {
        return ("0" + Math.trunc(this.duration / 60)).slice(-2) + ":" + ("0" + Math.trunc(this.duration % 60)).slice(-2);
    }

    /**
     * Get the percent played
     */
    get percent() {
        return (100 - Math.round((this.duration - this.displayTime) / this.duration * 100));
    }

    /**
     * Get the remaining time in text format
     */
    get remainingTimeDisplay() {
        return ("0" + Math.trunc((this.duration - this.displayTime) / 60)).slice(-2) + ":" + ("0" + Math.trunc((this.duration - this.displayTime) % 60)).slice(-2);
    }

    get order(): number {
        return -1;
    }

    get id(): string {
        return Constants.BUFFER_PLAYER;
    }
}
