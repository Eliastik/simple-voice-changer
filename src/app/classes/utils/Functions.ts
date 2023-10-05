const utilFunctions = {
    calcAudioDuration: (audio: AudioBuffer, speed: number, reverb: boolean, reverbAddDuration: number, echo: boolean) => {
        if(audio) {
            let duration = audio.duration + 1;
            const reverb_duration = reverbAddDuration;
        
            if(speed) duration = duration / speed;
        
            if(echo && reverb) {
                const addDuration = Math.max(5, reverb_duration);
                duration = duration + addDuration;
            } else if(echo) {
                duration = duration + 5;
            } else if(reverb) {
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
    
                if(result instanceof ArrayBuffer) {
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
            const newBuffer = context.createBuffer(2, context.sampleRate * buffer.duration + context.sampleRate * 2, context.sampleRate);
    
            for (let channel = 0; channel < newBuffer.numberOfChannels; channel++) {
                const nowBuffering = newBuffer.getChannelData(channel);
    
                for (let i = 0; i < buffer.length; i++) {
                    nowBuffering[i] = buffer.getChannelData(0)[i];
                }
            }
    
            return newBuffer;
        }
        
        return buffer;
    }
};

export default utilFunctions;