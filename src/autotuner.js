function HTTPain(channels, sampleRate, bufferSize, keyID, isMaj) {
  var M_PI = 3.14159265358979323846; // just a constant for pi
  this.halfStep = 17.32 / 16.35; // multiplying value to shift a frequency up by a half-step
  this.bufferSize = bufferSize; // the buffer size for our script processor node
  this.osamp = 16; // oversampling factor
  this.fftSize = this.bufferSize * this.osamp; // our FFT frame size
  this.fftSize2 = this.fftSize / 2; // half the FFT size, useful for spectral processing
  this.hopSize = this.bufferSize; // the hop size for our overlap add- just use SPN buffer size
  this.fs = sampleRate || 44100; // sample rate
  this.fifoInCounter = []; // counter to step through the constant FIFO input buffer
  this.fifoOutCounter = []; // counter to step through the constant FIFO output buffer
  this.expPhaseDiff = 2.0 * M_PI * this.hopSize/this.fftSize; // the expected phase difference between 2 FFT bins
  this.freqPerBin = this.fs / this.fftSize; // frequency per bin. will just be fs / FFT size
  this.isMaj = isMaj == undefined ? true : isMaj; // flag that denotes whether we've selected a major key
  this.keyID = keyID || 1; // ID of a key- C is 1, C# is 2, ...., B is 12.
  this.fft;
  this.fifoIn = [];
  this.fifoOut = [];
  this.aMagnitude = [];
  this.aFrequency = [];
  this.lastPhase = [];
  this.sumPhase = [];

  // Basic note frequency lookup table for a MAJOR scale from C0 to B8.
  this.majorScale = [
      16.35,18.35,20.60,21.83,24.50,27.50,30.87,32.70,
      36.71,41.20,43.65,49.00,55.00,61.74,65.41,73.42,
      82.41,87.31,98.00,110.00,123.47,130.81,146.83,164.81,
      174.61,196.00,220.00,246.94,261.63,293.66,329.63,349.23,
      392.00,440.00,493.88,523.25,587.33,659.25,698.46,783.99,
      880.00,987.77,1046.50,1174.66,1318.51,1396.91,1567.98,1760.00,
      1975.53,2093.00,2349.32,2637.02,2793.83,3135.96,3520.00,3951.07,
      4186.01,4698.63,5274.04,5587.65,6271.93,7040.00,7902.13
  ];

  // Basic note frequency lookup table for a NATURAL MINOR scale from C0 to B8.
  this.minorScale = [
      16.35,18.35,19.45,21.83,24.50,25.96,29.14,32.70,
      36.71,38.89,43.65,49.00,51.91,58.27,65.41,73.42,
      77.78,87.31,98.00,103.83,116.54,130.81,146.83,155.56,
      174.61,196.00,207.65,233.08,261.63,293.66,311.13,349.23,
      392.00,415.30,466.16,523.25,587.33,622.25,698.46,783.99,
      830.61,932.33,1046.50,1174.66,1244.51,1396.91,1567.98,1661.22,
      1864.66,2093.00,2349.32,2489.02,2793.83,3135.96,3322.44,3729.31,
      4186.01,4698.63,4978.03,5587.65,6271.93,6644.88,7458.62
  ];

  var obj = this;

  this.init = function() {
    // create an FFT object
    this.fft = new FFT(this.fftSize, this.fs);

    for(var i = 0; i < channels; i++) {
      // create our input/output windowing buffers
      this.fifoIn[i] = new Float32Array(this.fftSize);
      this.fifoOut[i] = new Float32Array(this.fftSize);

      // create static arrays / vars
      this.aMagnitude[i] = new Float32Array(this.fftSize);
      this.aFrequency[i] = new Float32Array(this.fftSize);
      this.lastPhase[i] = new Float32Array(this.fftSize2+1);
      this.sumPhase[i] = new Float32Array(this.fftSize2+1);

      this.fifoInCounter[i] = 0;
      this.fifoOutCounter[i] = 0;
    }
  };

  this.init();

  this.process = function(audioProcessingEvent) {
    var inputBuffer = audioProcessingEvent.inputBuffer;
    var outputBuffer = audioProcessingEvent.outputBuffer;

    for(var channel = 0; channel < outputBuffer.numberOfChannels; channel++) {
      // grab the input and output buffers
      var inputData = inputBuffer.getChannelData(channel);
      var outputData = outputBuffer.getChannelData(channel);

      // write the oldest frame in the fifo out buffer to output
      // and clear that space in the fifo out buffer
      for(var i = 0; i < obj.hopSize; i++){
          outputData[i] = obj.fifoOut[channel][obj.fifoInCounter[channel]+i];
          obj.fifoOut[channel][obj.fifoInCounter[channel]+i] = 0.0;
      }

      console.log(obj);

      // write the current frame into my input buffer
      for(var i = 0; i < obj.bufferSize; i++)
          obj.fifoIn[channel][obj.fifoInCounter[channel]+i] = inputData[i];

      // make sure we do windowing in order
      var next = obj.fifoInCounter[channel] + obj.hopSize;
      if(next == obj.fftSize)
          next = 0;

      // do the actual windowing
      var windowed = obj.hannWindow(obj.fifoIn[channel], next);

      // forward FFT
      obj.fft.forward(windowed);
      var real = obj.fft.real;
      var imag = obj.fft.imag;
      var phase = 0;
      var temp = 0;

      // Fourier analysis
      for(var i = 0; i <= obj.fftSize2; i++){
          // find the magnitude and phase
          obj.aMagnitude[channel][i] = 2.0*Math.sqrt(real[i]*real[i] + imag[i]*imag[i]);
          phase = Math.atan2(imag[i], real[i]);

          // find the phase difference
          temp = phase - obj.lastPhase[channel][i];
          obj.lastPhase[channel][i] = phase;

          // subtract the expected difference
          temp -= i*obj.expPhaseDiff;

          // map the phase difference between +/- pi
          var qpd = temp/M_PI;
          if(qpd >= 0)
              qpd += (qpd & 1);
          else
              qpd -= (qpd & 1);

          // get deviation and compute the true frequency
          temp -= M_PI*qpd;
          temp = (obj.osamp*temp)/(2.0*M_PI);
          temp = i*obj.freqPerBin + temp*obj.freqPerBin;
          obj.aFrequency[channel][i] = temp;
      }

      // for now we just get the frequency with the highest magnitude.
      // that should be good enough for voice, but it should be noted
      // that the the frequency with the highest magnitude isn't always
      // the fundamental, and in the future it would be wise to implement
      // a pitch detection algorithm here.
      var maxFreqIndex = 0;
      for(var i = 0; i < obj.aMagnitude[channel].length; i++){
          if(obj.aMagnitude[channel][i] > maxFreqIndex)
              maxFreqIndex = i;
      }

      // get the lookup table of note frequencies for the currently selected key.
      var noteArray = obj.multKey(obj.keyID, obj.isMaj);

      // get the shift factor
      var shiftFactor = obj.getShiftFactor(obj.aFrequency[channel][maxFreqIndex], noteArray);

      // create synthesis arrays
      var sMagnitude = new Float32Array(obj.fftSize);
      var sFrequency = new Float32Array(obj.fftSize);
      var index;

      // do the actual pitch shifting
      for(var i = 0; i <= obj.fftSize2; i++){
          index = Math.round(i*shiftFactor);
          if(index <= obj.fftSize2){
              sMagnitude[index] += obj.aMagnitude[channel][i];
              sFrequency[index] = obj.aFrequency[channel][i]*shiftFactor;
          }
      }

      // create a temp variable to hold magnitude in the synthesis loop
      var magn;

      // do synthesis
      for(var i = 0; i <= obj.fftSize2; i++){
          // get magnitude and freq values
          magn = sMagnitude[i];
          temp = sFrequency[i];

          // reverse our frequency bin deviation calculations
          temp -= i*obj.freqPerBin;
          temp /= obj.freqPerBin;
          temp = 2.0*M_PI*temp/obj.osamp;

          // factor the phase back in
          temp += i*obj.expPhaseDiff;
          obj.sumPhase[channel][i] += temp;
          phase = obj.sumPhase[channel][i];

          // store it away
          real[i] = magn*Math.cos(phase);
          imag[i] = magn*Math.sin(phase);
      }

      // zero negative frequencies. we only want the real result
      for(var i = obj.fftSize2+1; i < obj.fftSize; i++){
          real[i] = 0.0;
          imag[i] = 0.0;
      }

      // inverse FFT
      var ifft = obj.fft.inverse(real, imag);

      // windowing
      var processed = obj.hannWindow(ifft, 0);

      // add result to fifo out in time order
      var inc = obj.fifoOutCounter[channel];
      for(var i = 0; i < obj.fftSize; i++){
          obj.fifoOut[channel][i] += processed[inc]/obj.osamp;
          inc++;
          if(inc == obj.fftSize)
              inc = 0;
      }

      // decrement the fifo out frame counter and wrap if necessary
      obj.fifoOutCounter[channel] -= obj.hopSize;
      if(obj.fifoOutCounter[channel] == -obj.hopSize)
          obj.fifoOutCounter[channel] = obj.fftSize - obj.hopSize;

      // increment the fifo in frame counter and wrap if necessary
      obj.fifoInCounter[channel] += obj.hopSize;
      if(obj.fifoInCounter[channel] == obj.fftSize)
          obj.fifoInCounter[channel] = 0;
    }
  };

  // takes an array of data and an index (COUNTER) at which to start windowing, and implements
  // a Hann window. Note that DATA is maintained and we return a brand new array.
  this.hannWindow = function(data, counter) {
      var dataCopy = new Float32Array(data.length);
      for(var i = 0; i < dataCopy.length; i++){
          var mult = 0.5*(1.0 - Math.cos(2.0*M_PI*i/data.length));
          dataCopy[i] = data[counter]*mult;
          counter++;
          if(counter >= dataCopy.length)
              counter = 0;
      }
      return dataCopy;
  };

  // takes in our input frequency VALUE and an array NOTES containing all the note frequencies
  // in the desired key, and returns the closest value in NOTES to VALUE.
  this.getClosestVal = function(value, notes){
      var curr = notes[0];
      for(var i = 0; i < notes.length; i++){
          var c1 = Math.abs(value - notes[i]);
          var c2 = Math.abs(value - curr);
          if(c1 < c2)
              curr = notes[i];
      }
      return curr;
  };

  // calls the getClosestValue helper function to get the closest value to FREQVALUE,
  // then computes and returns the ratio between the two.
  this.getShiftFactor = function(freqValue, notes) {
      var closest = this.getClosestVal(freqValue, notes);
      var ratio = closest/freqValue;
      return ratio;
  };

  // multiplies the major or minor (depending on the value of boolean ISMAJ) scale tables
  // by VALUE, then returns them in a new array.
  this.multByVal = function(value, isMaj) {
      var outputArr = [];
      if(isMaj){
          for(var i = 0; i < this.majorScale.length; i++)
              outputArr.push(this.majorScale[i]*value);
      }else{
          for(var i = 0; i < this.minorScale.length; i++)
              outputArr.push(this.minorScale[i]*value);
      }
      return outputArr;
  };

  // uses MULTBYVAL(VALUE, ISMAJ) to multiply the template scales according to the musical key
  // signified by ID and the major/minor quality indicated by ISMAJ. Returns an array of the notes
  // in the desired scale.
  this.multKey = function(id, isMaj) {
      var notes;
      switch(id){
          case "1":
              notes = this.multByVal(1, isMaj);
              break;
          case "2":
              notes = this.multByVal(this.halfStep, isMaj);
              break;
          case "3":
              notes = this.multByVal(Math.pow(this.halfStep, 2), isMaj);
              break;
          case "4":
              notes = this.multByVal(Math.pow(this.halfStep, 3), isMaj);
              break;
          case "5":
              notes = this.multByVal(Math.pow(this.halfStep, 4), isMaj);
              break;
          case "6":
              notes = this.multByVal(Math.pow(this.halfStep, 5), isMaj);
              break;
          case "7":
              notes = this.multByVal(Math.pow(this.halfStep, 6), isMaj);
              break;
          case "8":
              notes = this.multByVal(Math.pow(this.halfStep, 7), isMaj);
              break;
          case "9":
              notes = this.multByVal(Math.pow(this.halfStep, 8), isMaj);
              break;
          case "10":
              notes = this.multByVal(Math.pow(this.halfStep, 9), isMaj);
              break;
          case "11":
              notes = this.multByVal(Math.pow(this.halfStep, 10), isMaj);
              break;
          case "12":
              notes = this.multByVal(Math.pow(this.halfStep, 11), isMaj);
              break;
          default:
              notes = this.multByVal(1, isMaj);
              break;
      }
      return notes;
  };
}

// Copyright (c) 2010 Corban Brook, released under the MIT license
// Fourier Transform Module used by DFT, FFT, RFT
// Slightly modified for packed DC/nyquist...
function FourierTransform(bufferSize, sampleRate) {
  this.bufferSize = bufferSize;
  this.sampleRate = sampleRate;
  this.bandwidth  = 2 / bufferSize * sampleRate / 2;

  this.spectrum   = new Float32Array(bufferSize/2);
  this.real       = new Float32Array(bufferSize);
  this.imag       = new Float32Array(bufferSize);

  this.peakBand   = 0;
  this.peak       = 0;

  /**
   * Calculates the *middle* frequency of an FFT band.
   *
   * @param {Number} index The index of the FFT band.
   *
   * @returns The middle frequency in Hz.
   */
  this.getBandFrequency = function(index) {
    return this.bandwidth * index + this.bandwidth / 2;
  };

  this.calculateSpectrum = function() {
    var spectrum  = this.spectrum,
        real      = this.real,
        imag      = this.imag,
        bSi       = 2 / this.bufferSize,
        sqrt      = Math.sqrt,
        rval,
        ival,
        mag;

    for (var i = 0, N = bufferSize/2; i < N; i++) {
      rval = real[i];
      ival = imag[i];
      mag = bSi * sqrt(rval * rval + ival * ival);

      if (mag > this.peak) {
        this.peakBand = i;
        this.peak = mag;
      }

      spectrum[i] = mag;
    }
  };
}

/**
 * FFT is a class for calculating the Discrete Fourier Transform of a signal
 * with the Fast Fourier Transform algorithm.
 *
 * @param {Number} bufferSize The size of the sample buffer to be computed. Must be power of 2
 * @param {Number} sampleRate The sampleRate of the buffer (eg. 44100)
 *
 * @constructor
 */
function FFT(bufferSize, sampleRate) {
  FourierTransform.call(this, bufferSize, sampleRate);

  this.reverseTable = new Uint32Array(bufferSize);

  var limit = 1;
  var bit = bufferSize >> 1;

  var i;

  while (limit < bufferSize) {
    for (i = 0; i < limit; i++) {
      this.reverseTable[i + limit] = this.reverseTable[i] + bit;
    }

    limit = limit << 1;
    bit = bit >> 1;
  }

  this.sinTable = new Float32Array(bufferSize);
  this.cosTable = new Float32Array(bufferSize);

  for (i = 0; i < bufferSize; i++) {
    this.sinTable[i] = Math.sin(-Math.PI/i);
    this.cosTable[i] = Math.cos(-Math.PI/i);
  }
}

/**
 * Performs a forward tranform on the sample buffer.
 * Converts a time domain signal to frequency domain spectra.
 *
 * @param {Array} buffer The sample buffer. Buffer Length must be power of 2
 *
 * @returns The frequency spectrum array
 */
FFT.prototype.forward = function(buffer) {
  // Locally scope variables for speed up
  var bufferSize      = this.bufferSize,
      cosTable        = this.cosTable,
      sinTable        = this.sinTable,
      reverseTable    = this.reverseTable,
      real            = this.real,
      imag            = this.imag,
      spectrum        = this.spectrum;

  var k = Math.floor(Math.log(bufferSize) / Math.LN2);

  if (Math.pow(2, k) !== bufferSize) { throw "Invalid buffer size, must be a power of 2."; }
  if (bufferSize !== buffer.length)  { throw "Supplied buffer is not the same size as defined FFT. FFT Size: " + bufferSize + " Buffer Size: " + buffer.length; }

  var halfSize = 1,
      phaseShiftStepReal,
      phaseShiftStepImag,
      currentPhaseShiftReal,
      currentPhaseShiftImag,
      off,
      tr,
      ti,
      tmpReal,
      i;

  for (i = 0; i < bufferSize; i++) {
    real[i] = buffer[reverseTable[i]];
    imag[i] = 0;
  }

  while (halfSize < bufferSize) {
    //phaseShiftStepReal = Math.cos(-Math.PI/halfSize);
    //phaseShiftStepImag = Math.sin(-Math.PI/halfSize);
    phaseShiftStepReal = cosTable[halfSize];
    phaseShiftStepImag = sinTable[halfSize];

    currentPhaseShiftReal = 1;
    currentPhaseShiftImag = 0;

    for (var fftStep = 0; fftStep < halfSize; fftStep++) {
      i = fftStep;

      while (i < bufferSize) {
        off = i + halfSize;
        tr = (currentPhaseShiftReal * real[off]) - (currentPhaseShiftImag * imag[off]);
        ti = (currentPhaseShiftReal * imag[off]) + (currentPhaseShiftImag * real[off]);

        real[off] = real[i] - tr;
        imag[off] = imag[i] - ti;
        real[i] += tr;
        imag[i] += ti;

        i += halfSize << 1;
      }

      tmpReal = currentPhaseShiftReal;
      currentPhaseShiftReal = (tmpReal * phaseShiftStepReal) - (currentPhaseShiftImag * phaseShiftStepImag);
      currentPhaseShiftImag = (tmpReal * phaseShiftStepImag) + (currentPhaseShiftImag * phaseShiftStepReal);
    }

    halfSize = halfSize << 1;
  }

  // Pack nyquist component.
  imag[0] = real[bufferSize / 2];
};

FFT.prototype.inverse = function(real, imag) {
  // Locally scope variables for speed up
  var bufferSize      = this.bufferSize,
      cosTable        = this.cosTable,
      sinTable        = this.sinTable,
      reverseTable    = this.reverseTable,
      spectrum        = this.spectrum;

      real = real || this.real;
      imag = imag || this.imag;

  var halfSize = 1,
      phaseShiftStepReal,
      phaseShiftStepImag,
      currentPhaseShiftReal,
      currentPhaseShiftImag,
      off,
      tr,
      ti,
      tmpReal,
      i;

      // Unpack and create mirror image.
      // This isn't that efficient, but let's us avoid having to deal with the mirror image part
      // when processing.
      var n = bufferSize;
      var nyquist = imag[0];
      imag[0] = 0;
      real[n / 2] = nyquist;
      imag[n / 2] = 0;

      // Mirror image complex conjugate.
      for (i = 1 + n / 2; i < n; i++) {
          real[i] = real[n - i];
          imag[i] = -imag[n - i];
      }

  for (i = 0; i < bufferSize; i++) {
    imag[i] *= -1;
  }

  var revReal = new Float32Array(bufferSize);
  var revImag = new Float32Array(bufferSize);





  for (i = 0; i < real.length; i++) {
    revReal[i] = real[reverseTable[i]];
    revImag[i] = imag[reverseTable[i]];
  }

  real = revReal;
  imag = revImag;

  while (halfSize < bufferSize) {
    phaseShiftStepReal = cosTable[halfSize];
    phaseShiftStepImag = sinTable[halfSize];
    currentPhaseShiftReal = 1;
    currentPhaseShiftImag = 0;

    for (var fftStep = 0; fftStep < halfSize; fftStep++) {
      i = fftStep;

      while (i < bufferSize) {
        off = i + halfSize;
        tr = (currentPhaseShiftReal * real[off]) - (currentPhaseShiftImag * imag[off]);
        ti = (currentPhaseShiftReal * imag[off]) + (currentPhaseShiftImag * real[off]);

        real[off] = real[i] - tr;
        imag[off] = imag[i] - ti;
        real[i] += tr;
        imag[i] += ti;

        i += halfSize << 1;
      }

      tmpReal = currentPhaseShiftReal;
      currentPhaseShiftReal = (tmpReal * phaseShiftStepReal) - (currentPhaseShiftImag * phaseShiftStepImag);
      currentPhaseShiftImag = (tmpReal * phaseShiftStepImag) + (currentPhaseShiftImag * phaseShiftStepReal);
    }

    halfSize = halfSize << 1;
  }

  var buffer = new Float32Array(bufferSize); // this should be reused instead
  for (i = 0; i < bufferSize; i++) {
    buffer[i] = real[i] / bufferSize;
  }

  return buffer;
};
