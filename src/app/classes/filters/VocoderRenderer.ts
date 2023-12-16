import AbstractAudioRenderer from "../model/AbstractAudioRenderer";
import Constants from "../model/Constants";
import Functions from "../utils/Functions";
import Vocoder from "../utils/Vocoder";

export default class VocoderRenderer extends AbstractAudioRenderer {

    constructor() {
        super();
    }

    renderAudio(context: BaseAudioContext, buffer: AudioBuffer): Promise<AudioBuffer> {
        return new Promise(resolve => {
            const durationAudio = Functions.calcAudioDuration(buffer, 1);
            const offlineContext = new OfflineAudioContext(2, context.sampleRate * durationAudio, context.sampleRate);
            
            offlineContext.oncomplete = e => {
                resolve(e.renderedBuffer);
            };

            if(this.bufferFetcherService) {
                const modulatorBuffer = this.bufferFetcherService.getAudioBuffer(Constants.VOCODER_MODULATOR);

                if(modulatorBuffer) {
                    const vocoder = new Vocoder(offlineContext, modulatorBuffer!, buffer);
                    vocoder.init();
                }
            }

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
