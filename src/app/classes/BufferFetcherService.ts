import utilFunctions from "./utils/Functions";

export default class BufferFetcherService {

    private context: AudioContext;
    private arrayBuffers: Map<string, ArrayBuffer> = new Map<string, ArrayBuffer>();
    private buffers: Map<string, AudioBuffer> = new Map<string, AudioBuffer>()
    private bufferErrors: string[] = [];

    constructor(context: AudioContext) {
        this.context = context;
    }

    public async fetchBuffer(bufferURI: string) {
        const response = await fetch(bufferURI);

        if(!response.ok) {
            this.bufferErrors.push(bufferURI);
        } else {
            this.arrayBuffers.set(this.getKeyFromLocation(bufferURI), await response.arrayBuffer());
        }
    }

    public async fetchAllBuffers(bufferURIs: string[]) {
        for(const uri of bufferURIs) {
            await this.fetchBuffer(uri);
        }
    }

    public async getAudioBuffer(filename: string): Promise<AudioBuffer | undefined> {
        const arrayBuffer = this.arrayBuffers.get(filename);

        if(this.buffers.get(filename) == null && arrayBuffer != null) {
            const buffer = await this.context.decodeAudioData(arrayBuffer.slice(0));

            this.buffers.set(filename, await utilFunctions.decodeBuffer(this.context, buffer));
            this.arrayBuffers.delete(filename);
        }

        return this.buffers.get(filename);
    }

    private getKeyFromLocation(location: string) {
        return location.substring(location.lastIndexOf("/") + 1);
    }
}