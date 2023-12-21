/*
 * Copyright (c) 2012 The Chromium Authors. All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *    * Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 *    * Redistributions in binary form must reproduce the above
 * copyright notice, this list of conditions and the following disclaimer
 * in the documentation and/or other materials provided with the
 * distribution.
 *    * Neither the name of Google Inc. nor the names of its
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
/*
 * Copyright (C) 2023 Eliastik (eliastiksofts.com)
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
interface VocoderBand {
    frequency: number;
}

export default class Vocoder {

    private FILTER_QUALITY = 6;  // The Q value for the carrier and modulator filters
    private FOURIER_SIZE = 4096;
    private WAVETABLEBOOST = 40.0;
    private SAWTOOTHBOOST = 0.40;
    private oscillatorType = 4;   // CUSTOM
    private oscillatorDetuneValue = 0;

    private audioContext: BaseAudioContext | null = null;
    private modulatorBuffer: AudioBuffer | undefined;
    private carrierBuffer: AudioBuffer | null = null;
    private modulatorNode: AudioBufferSourceNode | null = null;
    private vocoding = false;

    // These are "placeholder" gain nodes - because the modulator and carrier will get swapped in
    // as they are loaded, it's easier to connect these nodes to all the bands, and the "real"
    // modulator & carrier AudioBufferSourceNodes connect to these.
    private modulatorInput: GainNode | null = null;
    private carrierInput: GainNode | null = null;

    private modulatorGain: GainNode | null = null;
    private modulatorGainValue = 1.0;

    // noise node added to the carrier signal
    private noiseBuffer: AudioBuffer | null = null;
    private noiseNode: AudioBufferSourceNode | null = null;
    private noiseGain: GainNode | null = null;
    private noiseGainValue = 0.2;

    // Carrier sample gain
    private carrierSampleNode: AudioBufferSourceNode | null = null;
    private carrierSampleGain: GainNode | null = null;
    private carrierSampleGainValue = 0.0;

    // Carrier Synth oscillator stuff
    private oscillatorNode: OscillatorNode | null = null;
    private oscillatorGain: GainNode | null = null;
    private oscillatorGainValue = 1.0;
    private wavetable: PeriodicWave | null = null;
    private wavetableSignalGain: GainNode | null = null;

    // These are the arrays of nodes - the "columns" across the frequency band "rows"
    private modFilterBands: BiquadFilterNode[] | null = null;    // tuned bandpass filters
    private modFilterPostGains: GainNode[] | null = null;  // post-filter gains.
    private heterodynes: GainNode[] | null = null;   // gain nodes used to multiply bandpass X sine
    private powers: number[] | null = null;      // gain nodes used to multiply prev out by itself
    private lpFilters: BiquadFilterNode[] | null = null;   // tuned LP filters to remove doubled copy of product
    private lpFilterPostGains: GainNode[] | null = null;   // gain nodes for tuning input to waveshapers
    private carrierBands: BiquadFilterNode[] | null = null;  // tuned bandpass filters, same as modFilterBands but in carrier chain
    private carrierFilterPostGains: GainNode[] | null = null;  // post-bandpass gain adjustment
    private carrierBandGains: GainNode[] | null = null;  // these are the "control gains" driven by the lpFilters

    private vocoderBands: VocoderBand[] | null = null;
    private numVocoderBands: number = 0;

    private hpFilterGain: GainNode | null = null;
    private outputGain: GainNode | null = null;

    // Initialization function for the page.
    constructor(ctx: BaseAudioContext, carrierB: AudioBuffer, modulatorB?: AudioBuffer) {
        this.audioContext = ctx;
        this.carrierBuffer = carrierB;
        this.modulatorBuffer = modulatorB;
    }

    init() {
        this.generateVocoderBands(55, 7040, 28);
        // Set up the vocoder chains
        this.setupVocoderGraph();
        this.vocode();
    }

    getNodes() {
        return {
            modulatorNode: this.modulatorNode,
            modulatorGain: this.modulatorGain,
            synthLevel: this.oscillatorGain,
            noiseNode: this.noiseGain,
            oscillatorNode: this.oscillatorNode,
            hpFilterGain: this.hpFilterGain,
            outputGain: this.outputGain
        };
    }

    private shutOffCarrier() {
        if (this.oscillatorNode && this.noiseNode && this.carrierSampleNode) {
            this.oscillatorNode.stop(0);
            this.oscillatorNode = null;
            this.noiseNode.stop(0);
            this.noiseNode = null;
            this.carrierSampleNode.stop(0);
            this.carrierSampleNode = null;
        }
    }

    selectSawtooth() {
        if (this.wavetableSignalGain)
            this.wavetableSignalGain.gain.value = this.SAWTOOTHBOOST;
        if (this.oscillatorNode)
            this.oscillatorNode.type = "sawtooth";
    }

    selectWavetable() {
        if (this.wavetableSignalGain)
            this.wavetableSignalGain.gain.value = this.WAVETABLEBOOST;
        if (this.oscillatorNode && this.wavetable)
            this.oscillatorNode.setPeriodicWave(this.wavetable);
        if (this.wavetableSignalGain)
            this.wavetableSignalGain.gain.value = this.WAVETABLEBOOST;
    }

    updateModGain(value: number) {
        this.modulatorGainValue = value;
        if (this.modulatorGain)
            this.modulatorGain.gain.value = value;
    }

    // sample-based carrier
    updateSampleLevel(value: number) {
        this.carrierSampleGainValue = value;
        if (this.carrierSampleGain)
            this.carrierSampleGain.gain.value = value;
    }

    // noise in carrier
    updateSynthLevel(value: number) {
        this.oscillatorGainValue = value;
        if (this.oscillatorGain)
            this.oscillatorGain.gain.value = value;
    }

    // noise in carrier
    updateNoiseLevel(value: number) {
        this.noiseGainValue = value;
        if (this.noiseGain)
            this.noiseGain.gain.value = value;
    }

    // this will algorithmically re-calculate vocoder bands, distributing evenly
    // from startFreq to endFreq, splitting evenly (logarhythmically) into a given numBands.
    // The function places this info into the global vocoderBands and numVocoderBands letiables.
    private generateVocoderBands(startFreq: number, endFreq: number, numBands: number) {
        // Remember: 1200 cents in octave, 100 cents per semitone

        const totalRangeInCents = 1200 * Math.log(endFreq / startFreq) / Math.LN2;
        const centsPerBand = totalRangeInCents / numBands;
        const scale = Math.pow(2, centsPerBand / 1200);  // This is the scaling for successive bands

        this.vocoderBands = [];
        let currentFreq = startFreq;

        for (let i = 0; i < numBands; i++) {
            this.vocoderBands[i] = { frequency: currentFreq };
            //console.log( "Band " + i + " centered at " + currentFreq + "Hz" );
            currentFreq = currentFreq * scale;
        }

        this.numVocoderBands = numBands;
    }

    private loadNoiseBuffer() {  // create a 5-second buffer of noise
        if (!this.audioContext) return;

        const lengthInSamples = 5 * this.audioContext.sampleRate;
        this.noiseBuffer = this.audioContext.createBuffer(1, lengthInSamples, this.audioContext.sampleRate);
        const bufferData = this.noiseBuffer.getChannelData(0);

        for (let i = 0; i < lengthInSamples; ++i) {
            bufferData[i] = (2 * Math.random() - 1);  // -1 to +1
        }
    }

    private initBandpassFilters() {
        if (!this.audioContext) return;

        // When this function is called, the carrierNode and modulatorAnalyser
        // may not already be created.  Create placeholder nodes for them.
        this.modulatorInput = this.audioContext.createGain();
        this.carrierInput = this.audioContext.createGain();

        if (this.modFilterBands == null)
            this.modFilterBands = [];

        if (this.modFilterPostGains == null)
            this.modFilterPostGains = [];

        if (this.heterodynes == null)
            this.heterodynes = [];

        if (this.powers == null)
            this.powers = [];

        if (this.lpFilters == null)
            this.lpFilters = [];

        if (this.lpFilterPostGains == null)
            this.lpFilterPostGains = [];

        if (this.carrierBands == null)
            this.carrierBands = [];

        if (this.carrierFilterPostGains == null)
            this.carrierFilterPostGains = [];

        if (this.carrierBandGains == null)
            this.carrierBandGains = [];

        const waveShaperCurve = new Float32Array(65536);
        // Populate with a "curve" that does an abs()
        const n = 65536;
        const n2 = n / 2;
        let x;

        for (let i = 0; i < n2; ++i) {
            x = i / n2;

            waveShaperCurve[n2 + i] = x;
            waveShaperCurve[n2 - i - 1] = x;
        }

        // Set up a high-pass filter to add back in the fricatives, etc.
        // (this isn't used by default in the "production" version, as I hid the slider)
        const hpFilter = this.audioContext.createBiquadFilter();
        hpFilter.type = "highpass";
        hpFilter.frequency.value = 8000; // or use vocoderBands[numVocoderBands-1].frequency;
        hpFilter.Q.value = 1; //  no peaking
        this.modulatorInput.connect(hpFilter);

        this.hpFilterGain = this.audioContext.createGain();
        this.hpFilterGain.gain.value = 0.0;

        hpFilter.connect(this.hpFilterGain);

        if(this.modulatorBuffer) {
            this.hpFilterGain.connect(this.audioContext.destination);
        }

        //clear the arrays
        this.modFilterBands.length = 0;
        this.modFilterPostGains.length = 0;
        this.heterodynes.length = 0;
        this.powers.length = 0;
        this.lpFilters.length = 0;
        this.lpFilterPostGains.length = 0;
        this.carrierBands.length = 0;
        this.carrierFilterPostGains.length = 0;
        this.carrierBandGains.length = 0;

        this.outputGain = this.audioContext.createGain();

        if(this.modulatorBuffer) {
            this.outputGain.connect(this.audioContext.destination);
        }

        const rectifierCurve = new Float32Array(65536);
        for (let i = -32768; i < 32768; i++)
            rectifierCurve[i + 32768] = ((i > 0) ? i : -i) / 32768;

        for (let i = 0; i < this.numVocoderBands; i++) {
            // CREATE THE MODULATOR CHAIN
            // create the bandpass filter in the modulator chain
            const modulatorFilter = this.audioContext.createBiquadFilter();
            modulatorFilter.type = "bandpass";  // Bandpass filter
            if (this.vocoderBands)
                modulatorFilter.frequency.value = this.vocoderBands[i].frequency;
            modulatorFilter.Q.value = this.FILTER_QUALITY; //  initial quality
            this.modulatorInput.connect(modulatorFilter);
            this.modFilterBands.push(modulatorFilter);

            // Now, create a second bandpass filter tuned to the same frequency -
            // this turns our second-order filter into a 4th-order filter,
            // which has a steeper rolloff/octave
            const secondModulatorFilter = this.audioContext.createBiquadFilter();
            secondModulatorFilter.type = "bandpass";  // Bandpass filter
            if (this.vocoderBands)
                secondModulatorFilter.frequency.value = this.vocoderBands[i].frequency;
            secondModulatorFilter.Q.value = this.FILTER_QUALITY; //  initial quality
            //modulatorFilter.chainedFilter = secondModulatorFilter;
            modulatorFilter.connect(secondModulatorFilter);

            // create a post-filtering gain to bump the levels up.
            const modulatorFilterPostGain = this.audioContext.createGain();
            modulatorFilterPostGain.gain.value = 6;
            secondModulatorFilter.connect(modulatorFilterPostGain);
            this.modFilterPostGains.push(modulatorFilterPostGain);

            // Create the sine oscillator for the heterodyne
            const heterodyneOscillator = this.audioContext.createOscillator();
            if (this.vocoderBands)
                heterodyneOscillator.frequency.value = this.vocoderBands[i].frequency;

            heterodyneOscillator.start(0);

            // Create the node to multiply the sine by the modulator
            const heterodyne = this.audioContext.createGain();
            modulatorFilterPostGain.connect(heterodyne);
            heterodyne.gain.value = 0.0;  // audio-rate inputs are summed with initial intrinsic value
            heterodyneOscillator.connect(heterodyne.gain);

            const heterodynePostGain = this.audioContext.createGain();
            heterodynePostGain.gain.value = 2.0;    // GUESS:  boost
            heterodyne.connect(heterodynePostGain);
            this.heterodynes.push(heterodynePostGain);


            // Create the rectifier node
            const rectifier = this.audioContext.createWaveShaper();
            rectifier.curve = rectifierCurve;
            heterodynePostGain.connect(rectifier);

            // Create the lowpass filter to mask off the difference (near zero)
            const lpFilter = this.audioContext.createBiquadFilter();
            lpFilter.type = "lowpass";  // Lowpass filter
            lpFilter.frequency.value = 5.0; // Guesstimate!  Mask off 20Hz and above.
            lpFilter.Q.value = 1; // don't need a peak
            this.lpFilters.push(lpFilter);
            rectifier.connect(lpFilter);

            const lpFilterPostGain = this.audioContext.createGain();
            lpFilterPostGain.gain.value = 1.0;
            lpFilter.connect(lpFilterPostGain);
            this.lpFilterPostGains.push(lpFilterPostGain);

            const waveshaper = this.audioContext.createWaveShaper();
            waveshaper.curve = waveShaperCurve;
            lpFilterPostGain.connect(waveshaper);


            // Create the bandpass filter in the carrier chain
            const carrierFilter = this.audioContext.createBiquadFilter();
            carrierFilter.type = "bandpass";
            if (this.vocoderBands)
                carrierFilter.frequency.value = this.vocoderBands[i].frequency;
            carrierFilter.Q.value = this.FILTER_QUALITY;
            this.carrierBands.push(carrierFilter);
            this.carrierInput.connect(carrierFilter);

            // We want our carrier filters to be 4th-order filter too.
            const secondCarrierFilter = this.audioContext.createBiquadFilter();
            secondCarrierFilter.type = "bandpass";  // Bandpass filter
            if (this.vocoderBands)
                secondCarrierFilter.frequency.value = this.vocoderBands[i].frequency;
            secondCarrierFilter.Q.value = this.FILTER_QUALITY; //  initial quality
            //carrierFilter.chainedFilter = secondCarrierFilter;
            carrierFilter.connect(secondCarrierFilter);

            const carrierFilterPostGain = this.audioContext.createGain();
            carrierFilterPostGain.gain.value = 10.0;
            secondCarrierFilter.connect(carrierFilterPostGain);
            this.carrierFilterPostGains.push(carrierFilterPostGain);

            // Create the carrier band gain node
            const bandGain = this.audioContext.createGain();
            this.carrierBandGains.push(bandGain);
            carrierFilterPostGain.connect(bandGain);
            bandGain.gain.value = 0.0;  // audio-rate inputs are summed with initial intrinsic value
            waveshaper.connect(bandGain.gain);  // connect the lp controller

            bandGain.connect(this.outputGain);
        }


        // Now set up our wavetable stuff.
        const real = new Float32Array(this.FOURIER_SIZE);
        const imag = new Float32Array(this.FOURIER_SIZE);
        real[0] = 0.0;
        imag[0] = 0.0;
        for (let i = 1; i < this.FOURIER_SIZE; i++) {
            real[i] = 1.0;
            imag[i] = 1.0;
        }

        this.wavetable = this.audioContext.createPeriodicWave(real, imag);
        this.loadNoiseBuffer();
    }

    private setupVocoderGraph() {
        this.initBandpassFilters();
    }

    private createCarriersAndPlay(output: GainNode | null) {
        if(!this.audioContext || !output) return;

        this.carrierSampleNode = this.audioContext.createBufferSource();
        this.carrierSampleNode.buffer = this.carrierBuffer;
        this.carrierSampleNode.loop = true;

        this.carrierSampleGain = this.audioContext.createGain();
        this.carrierSampleGain.gain.value = this.carrierSampleGainValue;
        this.carrierSampleNode.connect(this.carrierSampleGain);
        this.carrierSampleGain.connect(output);

        // The wavetable signal needs a boost.
        this.wavetableSignalGain = this.audioContext.createGain();

        this.oscillatorNode = this.audioContext.createOscillator();
        if (this.oscillatorType == 4 && this.wavetable) { // wavetable
            this.oscillatorNode.setPeriodicWave(this.wavetable);
            this.wavetableSignalGain.gain.value = this.WAVETABLEBOOST;
        } else {
            //oscillatorNode.type = oscillatorType;
            this.wavetableSignalGain.gain.value = this.SAWTOOTHBOOST;
        }
        this.oscillatorNode.frequency.value = 110;
        this.oscillatorNode.detune.value = this.oscillatorDetuneValue;
        this.oscillatorNode.connect(this.wavetableSignalGain);

        this.oscillatorGain = this.audioContext.createGain();
        this.oscillatorGain.gain.value = this.oscillatorGainValue;

        this.wavetableSignalGain.connect(this.oscillatorGain);
        this.oscillatorGain.connect(output);

        this.noiseNode = this.audioContext.createBufferSource();
        this.noiseNode.buffer = this.noiseBuffer;
        this.noiseNode.loop = true;
        this.noiseGain = this.audioContext.createGain();
        this.noiseGain.gain.value = this.noiseGainValue;
        this.noiseNode.connect(this.noiseGain);

        this.noiseGain.connect(output);
        this.oscillatorNode.start(0);
        this.noiseNode.start(0);
        this.carrierSampleNode.start(0);

    }

    private vocode() {
        if(!this.audioContext) return;

        if (this.vocoding) {
            if (this.modulatorNode) {
                this.modulatorNode.stop(0);
            }
            this.shutOffCarrier();
            this.vocoding = false;
            return;
        }

        this.createCarriersAndPlay(this.carrierInput);

        this.vocoding = true;

        this.modulatorGain = this.audioContext.createGain();
        this.modulatorGain.gain.value = this.modulatorGainValue;

        if(this.modulatorBuffer) {
            this.modulatorNode = this.audioContext.createBufferSource();
            this.modulatorNode.buffer = this.modulatorBuffer;
            this.modulatorNode.connect(this.modulatorGain);
            this.modulatorNode.start(0);
        }

        if (this.modulatorInput)
            this.modulatorGain.connect(this.modulatorInput);
    }
}
