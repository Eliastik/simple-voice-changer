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
// Source: https://webaudiotech.com/2016/01/21/should-your-web-audio-app-have-a-limiter/
// Original code: https://webaudiotech.com/sites/limiter_comparison/limiter.js
// Additions by Eliastik (eliastiksofts.com): Stereo and multi-channel support, code simplified in one object class (Limiter)
import AbstractAudioFilter from "../model/AbstractAudioFilter";
import Constants from "../model/Constants";
import DelayBuffer from "../utils/DelayBuffer";

export default class LimiterFilter extends AbstractAudioFilter {
    private sampleRate = 44100; // Hz
    private preGain = 0; // dB
    private postGain = 0; // dB
    private attackTime = 0; // s
    private releaseTime = 3; // s
    private threshold = -0.05; // dB
    private lookAheadTime = 0.05; // s
    private delayBuffer: DelayBuffer[] = [];
    private envelopeSample = 0;
    private bufferSize = 4096;
    private channels = 2;
    private limiterProcessor: ScriptProcessorNode | null = null;

    constructor(sampleRate: number, preGain: number, postGain: number, attackTime: number, releaseTime: number, threshold: number, lookAheadTime: number, bufferSize: number, channels: number) {
        super();
        this.sampleRate = sampleRate || this.sampleRate;
        this.preGain = preGain || this.preGain;
        this.postGain = postGain || this.postGain;
        this.attackTime = attackTime || this.attackTime;
        this.releaseTime = releaseTime || this.releaseTime;
        this.threshold = threshold || this.threshold;
        this.lookAheadTime = lookAheadTime || this.lookAheadTime;
        this.bufferSize = bufferSize || this.bufferSize;
        this.channels = channels || this.channels;
        this.enable();
        this.setDefaultEnabled(true);
    }

    getEnvelope(data: Float32Array, attackTime: number, releaseTime: number, sampleRate: number) {
        const attackGain = Math.exp(-1 / (sampleRate * attackTime));
        const releaseGain = Math.exp(-1 / (sampleRate * releaseTime));

        const envelope = new Float32Array(data.length);

        for (let i = 0; i < data.length; i++) {
            const envIn = Math.abs(data[i]);

            if (this.envelopeSample < envIn) {
                this.envelopeSample = envIn + attackGain * (this.envelopeSample - envIn);
            } else {
                this.envelopeSample = envIn + releaseGain * (this.envelopeSample - envIn);
            }

            envelope[i] = this.envelopeSample;
        }

        return envelope;
    }

    getMaxEnvelope(envelope: Float32Array[], channels: number, index: number) {
        let max = envelope[0][index];

        for (let channel = 0; channel < channels; channel++) {
            if (envelope[channel][index] > max) {
                max = envelope[channel][index];
            }
        }

        return max;
    }

    ampToDB(value: number) {
        return 20 * Math.log10(value);
    }

    dBToAmp(db: number) {
        return Math.pow(10, db / 20);
    }

    limit(audioProcessingEvent: AudioProcessingEventInit) {
        const inputBuffer = audioProcessingEvent.inputBuffer;
        const outputBuffer = audioProcessingEvent.outputBuffer;
        const envelopeData = [];

        // transform db to amplitude value
        const postGainAmp = this.dBToAmp(this.preGain);
        const preGainAmp = this.dBToAmp(this.preGain);

        // apply pre gain to signal
        // compute the envelope for each channel
        for (let channel = 0; channel < outputBuffer.numberOfChannels; channel++) {
            const inp = inputBuffer.getChannelData(channel);
            const out = outputBuffer.getChannelData(channel);

            // create a delay buffer
            if (this.delayBuffer[channel] == null) {
                this.delayBuffer[channel] = new DelayBuffer(this.lookAheadTime * this.sampleRate);
            }

            // apply pre gain to signal
            for (let k = 0; k < inp.length; ++k) {
                out[k] = preGainAmp * inp[k];
            }

            // compute the envelope
            envelopeData[channel] = this.getEnvelope(out, this.attackTime, this.releaseTime, this.sampleRate);
        }

        for (let channel = 0; channel < outputBuffer.numberOfChannels; channel++) {
            const inp = inputBuffer.getChannelData(channel);
            const out = outputBuffer.getChannelData(channel);

            if (this.lookAheadTime > 0) {
                // write signal into buffer and read delayed signal
                for (let i = 0; i < out.length; i++) {
                    this.delayBuffer[channel].push(out[i]);
                    out[i] = this.delayBuffer[channel].read();
                }
            }

            // limiter mode: slope is 1
            const slope = 1;

            for (let i = 0; i < inp.length; i++) {
                let gainDB = slope * (this.threshold - this.ampToDB(this.getMaxEnvelope(envelopeData, outputBuffer.numberOfChannels, i))); // max gain

                // is gain below zero?
                gainDB = Math.min(0, gainDB);
                const gain = this.dBToAmp(gainDB);
                out[i] *= (gain * postGainAmp);
            }
        }
    }

    getNode(context: BaseAudioContext): AudioFilterNodes {
        if(this.limiterProcessor && context == this.limiterProcessor.context) {
            this.limiterProcessor.onaudioprocess = null;
        } else {
            this.limiterProcessor = context.createScriptProcessor(this.bufferSize, this.channels, this.channels);
            this.reset();
        }

        this.limiterProcessor.onaudioprocess = e => this.limit(e);

        return {
            input: this.limiterProcessor,
            output: this.limiterProcessor
        };
    }

    reset() {
        for (let i = 0; i < this.delayBuffer.length; i++) {
            if (this.delayBuffer[i] != null) {
                this.delayBuffer[i].reset();
            }
        }

        this.envelopeSample = 0;
    }

    getOrder(): number {
        return 10;
    }

    getId(): string {
        return Constants.FILTERS_NAMES.LIMITER;
    }

    getSettings() {
        return {
            preGain: this.preGain,
            postGain: this.postGain,
            attackTime: this.attackTime,
            releaseTime: this.releaseTime,
            threshold: this.threshold,
            lookAheadTime: this.lookAheadTime,
        };
    }

    async setSetting(settingId: string, value: string) {
        if(!value || value == "" || isNaN(Number(value))) {
            return;
        }
        
        switch (settingId) {
            case "preGain":
                this.preGain = parseFloat(value);
                break;
            case "postGain":
                this.postGain = parseFloat(value);
                break;
            case "attackTime":
                this.attackTime = parseFloat(value);
                break;
            case "releaseTime":
                this.releaseTime = parseFloat(value);
                break;
            case "threshold":
                this.threshold = parseFloat(value);
                break;
            case "lookAheadTime":
                this.lookAheadTime = parseFloat(value);
                break;
        }
    }
}