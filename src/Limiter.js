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
// Source: https://webaudiotech.com/2016/01/21/should-your-web-audio-app-have-a-limiter/
// Original code: https://webaudiotech.com/sites/limiter_comparison/limiter.js
// Additions by Eliastik (eliastiksofts.com): Stereo and multi-channel support, code simplified in one object class (Limiter)
import DelayBuffer from "./DelayBuffer";

export default class Limiter {
    constructor(sampleRate, preGain, postGain, attackTime, releaseTime, threshold, lookAheadTime) {
        this.sampleRate = sampleRate || 44100; // Hz
        this.preGain = preGain || 0; // dB
        this.postGain = postGain || 0; // dB
        this.attackTime = attackTime || 0; // s
        this.releaseTime = releaseTime || 3; // s
        this.threshold = threshold || -0.05; // dB
        this.lookAheadTime = lookAheadTime || 0.05; // s
        this.delayBuffer = [];
        this.envelopeSample = 0;
    }

    getEnvelope(data, attackTime, releaseTime, sampleRate) {
        var attackGain = Math.exp(-1 / (sampleRate * attackTime));
        var releaseGain = Math.exp(-1 / (sampleRate * releaseTime));

        var envelope = new Float32Array(data.length);

        for(var i = 0; i < data.length; i++) {
            var envIn = Math.abs(data[i]);

            if(this.envelopeSample < envIn) {
                this.envelopeSample = envIn + attackGain * (this.envelopeSample - envIn);
            } else {
                this.envelopeSample = envIn + releaseGain * (this.envelopeSample - envIn);
            }

            envelope[i] = this.envelopeSample;
        }

        return envelope;
    }

    getMaxEnvelope(envelope, channels, index) {
        var max = envelope[0][index];

        for(var channel = 0; channel < channels; channel++) {
            if(envelope[channel][index] > max) {
                max = envelope[channel][index];
            }
        }

        return max;
    }

    ampToDB(value) {
        return 20 * Math.log10(value);
    }

    dBToAmp(db) {
        return Math.pow(10, db / 20);
    }

    limit(audioProcessingEvent) {
        var inputBuffer = audioProcessingEvent.inputBuffer;
        var outputBuffer = audioProcessingEvent.outputBuffer;
        var envelopeData = [];

        // transform db to amplitude value
        var postGainAmp = this.dBToAmp(this.preGain);
        var preGainAmp = this.dBToAmp(this.preGain);

        // apply pre gain to signal
        // compute the envelope for each channel
        for(var channel = 0; channel < outputBuffer.numberOfChannels; channel++) {
            var inp = inputBuffer.getChannelData(channel);
            var out = outputBuffer.getChannelData(channel);

            // create a delay buffer
            if(this.delayBuffer[channel] == null) {
                this.delayBuffer[channel] = new DelayBuffer(this.lookAheadTime * this.sampleRate);
            }

            // apply pre gain to signal
            for(var k = 0; k < inp.length; ++k) {
                out[k] = preGainAmp * inp[k];
            }

            // compute the envelope
            envelopeData[channel] = this.getEnvelope(out, this.attackTime, this.releaseTime, this.sampleRate, channel);
        }

        for(var channel = 0; channel < outputBuffer.numberOfChannels; channel++) {
            var inp = inputBuffer.getChannelData(channel);
            var out = outputBuffer.getChannelData(channel);

            if(this.lookAheadTime > 0) {
                // write signal into buffer and read delayed signal
                for(var i = 0; i < out.length; i++) {
                    this.delayBuffer[channel].push(out[i]);
                    out[i] = this.delayBuffer[channel].read();
                }
            }

            // limiter mode: slope is 1
            var slope = 1;

            for(var i = 0; i < inp.length; i++) {
                var gainDB = slope * (this.threshold - this.ampToDB(this.getMaxEnvelope(envelopeData, outputBuffer.numberOfChannels, i))); // max gain

                // is gain below zero?
                gainDB = Math.min(0, gainDB);
                var gain = this.dBToAmp(gainDB);
                out[i] *= (gain * postGainAmp);
            }
        }
    }

    reset() {
        for(var i = 0; i < this.delayBuffer.length; i++) {
            if(this.delayBuffer[i] != null) {
                this.delayBuffer[i].reset();
            }
        }

        this.envelopeSample = 0;
    }
}