import EventEmitter from "../utils/EventEmitter";
import { EventType } from "../model/EventTypeEnum";
import utilFunctions from "../utils/Functions";

export default class BufferFetcherService {

    private context: AudioContext;
    private buffers: Map<string, AudioBuffer> = new Map<string, AudioBuffer>();
    private bufferErrors: string[] = [];
    private eventEmitter: EventEmitter | null;

    constructor(context: AudioContext, eventEmitter?: EventEmitter) {
        this.context = context;
        this.eventEmitter = eventEmitter || new EventEmitter();
    }

    async fetchBuffer(bufferURI: string, force?: boolean) {
        if(this.buffers.get(this.getKeyFromLocation(bufferURI)) != null && !force) {
            return;
        }

        this.eventEmitter?.emit(EventType.FETCHING_BUFFERS, bufferURI);

        try {
            const response = await fetch(bufferURI);

            if(!response.ok) {
                this.bufferErrors.push(bufferURI);
                this.eventEmitter?.emit(EventType.FETCHING_BUFFERS_ERROR, bufferURI);
                throw EventType.FETCHING_BUFFERS_ERROR;
            } else {
                const arrayBuffer = await response.arrayBuffer();
                const buffer = await this.context.decodeAudioData(arrayBuffer);
                this.buffers.set(this.getKeyFromLocation(bufferURI), await utilFunctions.decodeBuffer(this.context, buffer));
            }
    
            this.eventEmitter?.emit(EventType.FINISHED_FETCHING_BUFFERS, bufferURI);
        } catch(e) {
            this.bufferErrors.push(bufferURI);
            this.eventEmitter?.emit(EventType.FETCHING_BUFFERS_ERROR, bufferURI);
            throw EventType.FETCHING_BUFFERS_ERROR;
        }
    }

    async fetchAllBuffers(bufferURIs: string[]) {
        for(const uri of bufferURIs) {
            await this.fetchBuffer(uri);
        }
    }

    getAudioBuffer(filename: string): AudioBuffer | undefined {
        return this.buffers.get(this.getKeyFromLocation(filename));
    }

    async getOrFetchAudioBuffer(filename: string): Promise<AudioBuffer | undefined> {
        if(this.getAudioBuffer(filename) == null) {
            await this.fetchBuffer(filename);
        }

        return this.getAudioBuffer(filename);
    }

    getDownloadedBuffersList(): string[] {
        return Array.from(this.buffers.keys());
    }

    private getKeyFromLocation(location: string) {
        return location.substring(location.lastIndexOf("/") + 1);
    }

    updateContext(context: AudioContext) {
        this.context = context;
    }

    reset() {
        this.buffers.clear();
    }
}
