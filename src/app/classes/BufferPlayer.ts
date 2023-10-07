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
// Also used in compatibility mode (which doesn't use audio buffer) with less functions (no time control)
export default class BufferPlayer {
    onUpdate: Function | null = null;
    onPlayingFinished: Function | null = null;

    context: AudioContext | OfflineAudioContext | null = null;
    buffer: AudioBuffer | null = null;
    source: AudioBufferSourceNode | null = null;
    currentTime = 0;
    displayTime = 0;
    duration = 0;
    interval: number | null = null;
    playing = false;
    sliding = false;
    loop = false;
    compatibilityMode = false;
    speedAudio = 1;
    
    constructor(context: AudioContext | OfflineAudioContext) {
        this.context = context;

        /*if(this.sliderPlayAudio != undefined) {
            this.sliderPlayAudio.on("slideStart", () => {
                if(!this.compatibilityMode) this.sliding = true;
            });
    
            this.sliderPlayAudio.on("slide", value => {
                if(!this.compatibilityMode) {
                    this.displayTime = Math.round(this.duration * (value / 100));
                    this.updateInfos();
                }
            });
    
            this.sliderPlayAudio.on("slideStop", value => {
                if(!this.compatibilityMode) {
                    this.sliding = false;
                    this.currentTime = Math.round(this.duration * (value / 100));
                    this.displayTime = this.currentTime;
    
                    if(this.playing) {
                        this.pause();
                        this.start();
                    } else {
                        this.updateInfos();
                    }
                }
            });
        }*/
    }

    init() {
        this.playing = false;

        if(this.context) {
            this.context.resume();

            if(!this.compatibilityMode && this.buffer) {
                if(this.source != null) this.source.disconnect();
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

    setCompatibilityMode(duration: number) {
        this.compatibilityMode = true;
        this.reset();
        this.init();
        this.duration = duration * this.speedAudio;
    }

    reset() {
        clearInterval(this.interval!);
        this.currentTime = 0;
        this.displayTime = 0;
        this.stop();
    }

    stop() {
        clearInterval(this.interval!);
        
        if(this.source != undefined && this.source != null && this.playing && !this.compatibilityMode) {
            this.source.stop(0);
            this.playing = false;
        }

        this.updateInfos();
    }

    start() {
        if((this.source != undefined && this.source != null) || this.compatibilityMode) {
            this.stop();
            this.init();

            if(!this.compatibilityMode && this.source) {
                this.source.start(0, this.currentTime / this.speedAudio);
                this.playing = true;
            }

            this.interval = window.setInterval(() => {
                this.currentTime += 0.2 * this.speedAudio;

                if(!this.sliding) {
                    this.displayTime = this.currentTime;
                }

                if(this.currentTime > this.duration) {
                    if(this.loop && !this.compatibilityMode) {
                        this.reset();
                        this.start();
                    } else {
                        this.reset();
                    }

                    if(this.onPlayingFinished != null) {
                        this.onPlayingFinished();
                    }
                } else {
                    this.updateInfos();
                }
            }, 200);
        }
    }

    pause() {
        clearInterval(this.interval!);
        this.stop();
    }

    setOnPlayingFinished(func: Function) {
        this.onPlayingFinished = func;
    }

    setOnUpdate(func: Function) {
        this.onUpdate = func;
    }

    updateInfos() {
        if(this.onUpdate) this.onUpdate();
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