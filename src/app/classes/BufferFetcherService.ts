import utilFunctions from "./utils/Functions";

export default class BufferFetcherService {

    private context: AudioContext;
    private buffers: Map<string, AudioBuffer> = new Map<string, AudioBuffer>()
    private bufferErrors: string[] = [];

    constructor(context: AudioContext) {
        this.context = context;
    }

    public async fetchBuffer(bufferURI: string) {
        if(this.buffers.get(this.getKeyFromLocation(bufferURI)) != null) {
            return;
        }

        const response = await fetch(bufferURI);

        if(!response.ok) {
            this.bufferErrors.push(bufferURI);
        } else {
            const arrayBuffer = await response.arrayBuffer();
            const buffer = await this.context.decodeAudioData(arrayBuffer);
            this.buffers.set(this.getKeyFromLocation(bufferURI), await utilFunctions.decodeBuffer(this.context, buffer));
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

    private getKeyFromLocation(location: string) {
        return location.substring(location.lastIndexOf("/") + 1);
    }
}