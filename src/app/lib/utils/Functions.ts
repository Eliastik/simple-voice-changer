import { FilterSettingValue } from "../model/filtersSettings/FilterSettings";

const utilFunctions = {
    calcAudioDuration: (audio: AudioBuffer, speed: number) => {
        if (audio) {
            let duration = audio.duration + 1;

            if (speed) {
                duration = duration / speed;
            }

            return duration;
        }

        return 0;
    },
    loadAudioBuffer: async (context: AudioContext, file: File) => {
        const arrayBuffer = await utilFunctions.readAsArrayBufferPromisified(file);
        const audioBuffer = await context.decodeAudioData(arrayBuffer);
        return utilFunctions.decodeBuffer(context, audioBuffer);
    },
    readAsArrayBufferPromisified: (file: File): Promise<ArrayBuffer> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = ev => {
                const result = ev?.target?.result;

                if (result instanceof ArrayBuffer) {
                    resolve(result);
                } else {
                    reject();
                }
            };

            if (file) {
                reader.readAsArrayBuffer(file); // Read the file
            }
        });
    },
    decodeBuffer: (context: AudioContext, buffer: AudioBuffer) => {
        if (buffer.numberOfChannels == 1) { // convert to stereo buffer
            context.resume();

            const duration = buffer.duration;
            const sampleRate = context.sampleRate;

            const newBuffer = context.createBuffer(2, sampleRate * duration + sampleRate * 2, sampleRate);

            // Original buffer data
            const sourceChannelData = buffer.getChannelData(0);

            // Destination buffers
            const channel0Data = newBuffer.getChannelData(0);
            const channel1Data = newBuffer.getChannelData(1);

            for (let i = 0; i < sourceChannelData.length; i++) {
                channel0Data[i] = sourceChannelData[i];
                channel1Data[i] = sourceChannelData[i];
            }

            return newBuffer;
        }

        return buffer;
    },
    convertAudioBufferToFloat32Array: (buffer: AudioBuffer) => {
        const array: Float32Array[] = [];

        for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
            array.push(buffer.getChannelData(channel));
        }

        return array;
    },
    convertAudioParamToFloat32Array: (param: AudioParam, length: number) => {
        const array = new Float32Array(length);

        for (let i = 0; i < length; i++) {
            array.set([param.value], i);
        }

        return array;
    },
    sumAudioBufferChannel(buffer: AudioBuffer, channel: number) {
        return buffer.getChannelData(channel).reduce((a, b) => a + b, 0);
    },
    sumAudioBuffer(buffer: AudioBuffer) {
        let sum = 0;

        for(let channel = 0; channel < buffer.numberOfChannels; channel++) {
            sum += this.sumAudioBufferChannel(buffer, channel);
        }

        return sum;
    },
    /**
    * This method checks if the browser is compatible with audio worklets
    * @param audioContext 
    */
    isAudioWorkletCompatible(audioContext: BaseAudioContext) {
        if (typeof (audioContext) !== "undefined" && typeof (audioContext.audioWorklet) !== "undefined") {
            return true;
        }

        return false;
    },
    /**
     * Check that the setting value is correct
     * @param value FilterSettingValue
     */
    isSettingValueValid(value: FilterSettingValue) {
        return typeof(value) !== "undefined" && !isNaN(Number(value)) && !(typeof(value) === "string" && value.trim() === "");
    }
};

export default utilFunctions;
