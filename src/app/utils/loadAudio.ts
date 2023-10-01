async function loadAudioBuffer(file: Blob) {
    const context = new AudioContext();
    const arrayBuffer = await readAsArrayBufferPromisified(file);
    const audioBuffer = await context.decodeAudioData(arrayBuffer);
    return decodeBuffer(context, audioBuffer);
}

function readAsArrayBufferPromisified(file: Blob): Promise<ArrayBuffer> {
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
    })
}

function decodeBuffer(context: AudioContext, buffer: AudioBuffer) {
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

export { loadAudioBuffer, readAsArrayBufferPromisified, decodeBuffer };