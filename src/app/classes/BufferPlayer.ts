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

import EventEmitter from "./EventEmitter";
import { EventType } from "./model/EventTypeEnum";

// Also used in compatibility mode (which doesn't use audio buffer) with less functions (no time control)
export default class BufferPlayer {
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

    constructor(context: AudioContext | OfflineAudioContext, eventEmitter?: EventEmitter) {
        this.context = context;
        this.eventEmitter = eventEmitter || new EventEmitter();
    }

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

    loadBuffer(buffer: AudioBuffer) {
        this.compatibilityMode = false;
        this.reset();
        this.buffer = buffer;
        this.init();
    }

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

    reset() {
        clearInterval(this.interval!);
        this.currentTime = 0;
        this.displayTime = 0;
        this.stop();
    }

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

    pause() {
        this.stop();
    }

    updateInfos() {
        this.eventEmitter?.emit(EventType.PLAYING_UPDATE);
    }

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

    onBeforePlaying(callback: () => void) {
        this.onBeforePlayingCallback = callback;
    }

    toggleLoop() {
        this.loop = !this.loop;
    }

    on(event: string, callback: Function) {
        this.eventEmitter?.on(event, callback);
    }

    updateContext(context: AudioContext) {
        this.context = context;
    }

    get currentTimeDisplay() {
        return ("0" + Math.trunc(this.displayTime / 60)).slice(-2) + ":" + ("0" + Math.trunc(this.displayTime % 60)).slice(-2);
    }

    get maxTimeDisplay() {
        return ("0" + Math.trunc(this.duration / 60)).slice(-2) + ":" + ("0" + Math.trunc(this.duration % 60)).slice(-2);
    }

    get percent() {
        return (100 - Math.round((this.duration - this.displayTime) / this.duration * 100));
    }

    get remainingTimeDisplay() {
        return ("0" + Math.trunc((this.duration - this.displayTime) / 60)).slice(-2) + ":" + ("0" + Math.trunc((this.duration - this.displayTime) % 60)).slice(-2);
    }
}
