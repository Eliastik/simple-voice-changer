import AbstractAudioRenderer from "../model/AbstractAudioRenderer";
import Constants from "../model/Constants";
import utils from "../utils/Functions";
import vocoder from "../utils/Vocoder";

export default class VocoderRenderer extends AbstractAudioRenderer {
    constructor() {
        super();
    }

    renderAudio(context: BaseAudioContext, buffer: AudioBuffer): Promise<AudioBuffer> {
        return new Promise(resolve => {
            const durationAudio = utils.calcAudioDuration(buffer, 1, false, 0, false);
            const offlineContext = new OfflineAudioContext(2, context.sampleRate * durationAudio, context.sampleRate);
            
            offlineContext.oncomplete = e => {
                resolve(e.renderedBuffer);
            };

            vocoder(offlineContext, this.bufferFetcherService?.getAudioBuffer("modulator.mp3"), buffer);
            offlineContext.startRendering();
        });
    }
    
    get order(): number {
        return 1;
    }

    get id(): string {
        return Constants.FILTERS_NAMES.VOCODER;
    }
}
