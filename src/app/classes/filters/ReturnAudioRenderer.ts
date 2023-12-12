import AbstractAudioRenderer from "../model/AbstractAudioRenderer";
import Constants from "../model/Constants";

export default class ReturnAudioRenderer extends AbstractAudioRenderer {
    renderAudio(context: BaseAudioContext, buffer: AudioBuffer): Promise<AudioBuffer> {
        return new Promise(resolve => {
            const numChannels = buffer.numberOfChannels;
            const totalFrames = context.sampleRate * buffer.duration + context.sampleRate * 2;
            const bufferReturned = context.createBuffer(numChannels, totalFrames, context.sampleRate);

            for (let channel = 0; channel < numChannels; channel++) {
                const nowBuffering = bufferReturned.getChannelData(channel);
                const sourceChannelData = buffer.getChannelData(channel);

                for (let i = 0; i < totalFrames; i++) {
                    if (i < sourceChannelData.length) {
                        nowBuffering[i] = sourceChannelData[sourceChannelData.length - 1 - i];
                    } else {
                        nowBuffering[i] = 0;
                    }
                }
            }

            resolve(bufferReturned);
        });
    }

    get order(): number {
        return 0;
    }

    get id(): string {
        return Constants.FILTERS_NAMES.RETURN_AUDIO;
    }
}
