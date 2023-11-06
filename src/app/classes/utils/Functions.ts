const utilFunctions = {
    calcAudioDuration: (audio: AudioBuffer, speed: number, reverb: boolean, reverbAddDuration: number, echo: boolean) => {
        if (audio) {
            let duration = audio.duration + 1;
            const reverb_duration = reverbAddDuration;

            if (speed) duration = duration / speed;

            if (echo && reverb) {
                const addDuration = Math.max(5, reverb_duration);
                duration = duration + addDuration;
            } else if (echo) {
                duration = duration + 5;
            } else if (reverb) {
                duration = duration + reverb_duration;
            }

            return duration;
        }

        return 0;
    },
    loadAudioBuffer: async (file: File) => {
        const context = new AudioContext();
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
    }
};

export default utilFunctions;