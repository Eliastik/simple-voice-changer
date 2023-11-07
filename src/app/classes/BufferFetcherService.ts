import EventEmitter from "./EventEmitter";
import { EventType } from "./model/EventTypeEnum";
import utilFunctions from "./utils/Functions";

export default class BufferFetcherService {

    private context: AudioContext;
    private buffers: Map<string, AudioBuffer> = new Map<string, AudioBuffer>()
    private bufferErrors: string[] = [];
    private eventEmitter: EventEmitter | null;

    constructor(context: AudioContext, eventEmitter?: EventEmitter) {
        this.context = context;
        this.eventEmitter = eventEmitter || new EventEmitter();
    }

    public async fetchBuffer(bufferURI: string) {
        if(this.buffers.get(this.getKeyFromLocation(bufferURI)) != null) {
            return;
        }

        this.eventEmitter?.emit(EventType.FETCHING_BUFFERS, bufferURI);

        try {
            const response = await fetch(bufferURI);

            if(!response.ok) {
                this.bufferErrors.push(bufferURI);
                this.eventEmitter?.emit(EventType.FETCHING_BUFFERS_ERROR, bufferURI);
            } else {
                const arrayBuffer = await response.arrayBuffer();
                const buffer = await this.context.decodeAudioData(arrayBuffer);
                this.buffers.set(this.getKeyFromLocation(bufferURI), await utilFunctions.decodeBuffer(this.context, buffer));
            }
    
            this.eventEmitter?.emit(EventType.FINISHED_FETCHING_BUFFERS, bufferURI);
        } catch(e) {
            this.bufferErrors.push(bufferURI);
            this.eventEmitter?.emit(EventType.FETCHING_BUFFERS_ERROR, bufferURI);
        }
    }

    public async fetchAllBuffers(bufferURIs: string[]) {
        for(const uri of bufferURIs) {
            await this.fetchBuffer(uri);
        }
    }

    public getAudioBuffer(filename: string): AudioBuffer | undefined {
        return this.buffers.get(this.getKeyFromLocation(filename));
    }

    public async getOrFetchAudioBuffer(filename: string): Promise<AudioBuffer | undefined> {
        if(this.getAudioBuffer(filename) == null) {
            await this.fetchBuffer(filename);
        }

        return this.getAudioBuffer(filename);
    }

    public getDownloadedBuffersList(): string[] {
        return Array.from(this.buffers.keys());
    }

    private getKeyFromLocation(location: string) {
        return location.substring(location.lastIndexOf("/") + 1);
    }
}