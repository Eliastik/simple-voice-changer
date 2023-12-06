//@ts-ignore
import { SimpleFilter } from "soundtouchjs"; 

const noop = () => { return; };

export default class SoundtouchCustomFilter extends SimpleFilter {
    callback: () => void;
    private sourceSound: number[] = [];

    constructor(pipe: any, callback = noop){
        super(null, pipe, callback);
        this.callback = callback;
        super.historyBufferSize = 22050;
        super._sourcePosition = 0;
        super.outputBufferPosition = 0;
        super._position = 0;
    }

    putSource(source: Float32Array){ 
        for (let i = 0; i < source.length; i++) {
            this.sourceSound.push(source[i]);
        }
    }

    extractSource(outSamples: any, numFramesReq: any, frameOffset = 0){
        let numFramesExtracted = 0;

        if (this.sourceSound.length < numFramesReq*2) {
            numFramesExtracted = 0;
        } else { 
            outSamples.set(this.sourceSound.slice(0,numFramesReq*2));
            this.sourceSound.splice(0,numFramesReq*2);
            numFramesExtracted = numFramesReq;
        }

        return numFramesExtracted;
    }

    /* Override */
    fillInputBuffer(numFrames = 0){ // samples are LRLR 
        const samples = new Float32Array(numFrames * 2);
        const numFramesExtracted = this.extractSource(samples,numFrames);

        if (numFramesExtracted > 0)
            super.inputBuffer.putSamples(samples, 0, numFramesExtracted);
    }

    extract(target: any, numFrames = 0) {
        return super.extract(target, numFrames);
    }

    clear() {
        this.sourceSound = [];
    }
};
