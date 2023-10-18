import AbstractAudioRenderer from "../model/AbstractAudioRenderer";
import utils from "../utils/Functions";
import vocoder from "../utils/Vocoder";

export default class VocoderRenderer extends AbstractAudioRenderer {
    private modulatorBuffer: AudioBuffer | null = null; // TODO

    constructor(buffer: AudioBuffer | null) {
        super();
        this.modulatorBuffer = buffer;
    }

    renderAudio(context: BaseAudioContext, buffer: AudioBuffer): Promise<AudioBuffer> {
        return new Promise(resolve => {
            const durationAudio = utils.calcAudioDuration(buffer, 1, false, 0, false);
            const offlineContext = new OfflineAudioContext(2, context.sampleRate * durationAudio, context.sampleRate);
            
            offlineContext.oncomplete = e => {
                resolve(e.renderedBuffer);
            };
    
            vocoder(offlineContext, this.modulatorBuffer, buffer);
            offlineContext.startRendering();
        });
    }
    
    getOrder(): number {
        return 1;
    }

    getId(): string {
        return "vocoder";
    }
}