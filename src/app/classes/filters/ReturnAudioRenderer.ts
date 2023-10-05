import AbstractAudioRenderer from "../model/AbstractAudioRenderer";

export default class ReturnAudioRenderer extends AbstractAudioRenderer {
    renderAudio(context: BaseAudioContext, buffer: AudioBuffer): Promise<AudioBuffer> {
        return new Promise(resolve => {
            const bufferReturned = context.createBuffer(2, context.sampleRate * buffer.duration + context.sampleRate * 2, context.sampleRate);
    
            for(let channel = 0; channel < buffer.numberOfChannels; channel++) {
                const nowBuffering = bufferReturned.getChannelData(channel);
                
                for(let i = 0; i < bufferReturned.length; i++) {
                    nowBuffering[i] = buffer.getChannelData(channel)[buffer.length - 1 - i];
                }
    
                bufferReturned.getChannelData(channel).set(nowBuffering);
            }
    
            resolve(bufferReturned);
        });
    }
    
    getOrder(): number {
        return 0;
    }

    getId(): string {
        return "returnaudio";
    }
}