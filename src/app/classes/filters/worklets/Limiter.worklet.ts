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
// Additions by Eliastik (eliastiksofts.com): Stereo and multi-channel support, code simplified in one object class (Limiter), converted into AudioWorklet
import DelayBuffer from "../../model/DelayBuffer";

class LimiterProcessor extends AudioWorkletProcessor {
    delayBuffer: DelayBuffer[] = [];
    envelopeSample = 0;

    constructor() {
        super();
        this.port.onmessage = (event) => {
            if(event.data == "reset") {
                this.reset();
            }
        };
    }

    static get parameterDescriptors() {
        return [
            { name: "preGain", defaultValue: 0 },
            { name: "postGain", defaultValue: 0 },
            { name: "attackTime", defaultValue: 0 },
            { name: "releaseTime", defaultValue: 3 },
            { name: "threshold", defaultValue: -0.05 },
            { name: "lookAheadTime", defaultValue: 0 },
            { name: "sampleRate", defaultValue: 44100 }
        ];
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

    process(inputs: Float32Array[][], outputs: Float32Array[][], parameters: Record<string, Float32Array>): boolean {
        const inputBuffer = inputs[0];
        const outputBuffer = outputs[0];
        const envelopeData = [];

        // transform db to amplitude value
        const postGainAmp = this.dBToAmp(parameters.postGain[0]);
        const preGainAmp = this.dBToAmp(parameters.preGain[0]);

        // apply pre gain to signal
        // compute the envelope for each channel
        for (let channel = 0; channel < inputBuffer.length; channel++) {
            const inp = inputBuffer[channel];
            const out = outputBuffer[channel];

            // create a delay buffer
            if (this.delayBuffer[channel] == null) {
                this.delayBuffer[channel] = new DelayBuffer(parameters.lookAheadTime[0] * parameters.sampleRate[0]);
            }

            // apply pre gain to signal
            for (let k = 0; k < inp.length; ++k) {
                out[k] = preGainAmp * inp[k];
            }

            // compute the envelope
            envelopeData[channel] = this.getEnvelope(out, parameters.attackTime[0], parameters.releaseTime[0], parameters.sampleRate[0]);

            if (parameters.lookAheadTime[0] > 0) {
                // write signal into buffer and read delayed signal
                for (let i = 0; i < out.length; i++) {
                    this.delayBuffer[channel].push(out[i]);
                }
            }
        }

        for (let channel = 0; channel < inputBuffer.length; channel++) {
            const inp = inputBuffer[channel];
            const out = outputBuffer[channel];

            // If look-ahead is enabled, read delayed signal from buffer
            if (parameters.lookAheadTime[0] > 0) {
                // write signal into buffer and read delayed signal
                for (let i = 0; i < out.length; i++) {
                    out[i] = this.delayBuffer[channel].read();
                }
            }

            // limiter mode: slope is 1
            const slope = 1;

            for (let i = 0; i < inp.length; i++) {
                let gainDB = slope * (parameters.threshold[0] - this.ampToDB(this.getMaxEnvelope(envelopeData, inputBuffer.length, i))); // max gain

                // is gain below zero?
                gainDB = Math.min(0, gainDB);
                const gain = this.dBToAmp(gainDB);
                out[i] *= (gain * postGainAmp);
            }
        }

        return true;
    }

    reset() {
        for (let i = 0; i < this.delayBuffer.length; i++) {
            if (this.delayBuffer[i] != null) {
                this.delayBuffer[i].reset();
            }
        }

        this.envelopeSample = 0;
    }
}

registerProcessor("limiter-processor", LimiterProcessor);
