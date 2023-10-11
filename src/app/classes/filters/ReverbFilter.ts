import AbstractAudioFilter from "../model/AbstractAudioFilter";

export default class ReverbFilter extends AbstractAudioFilter {
    buffer: AudioBuffer | null = null;

    constructor(buffer: AudioBuffer | null) {
        super();
        this.buffer = buffer;
    }

    getNode(context: BaseAudioContext): AudioFilterNodes {
        const convolver = context.createConvolver();
        convolver.buffer = this.buffer;

        return {
            input: convolver,
            output: convolver
        };
    }
    
    getOrder(): number {
        return 9;
    }

    getId(): string {
        return "reverb";
    }

    getSettings() {
        return {};
    }

    setSetting(settingId: string, value: string): void {
        throw new Error("Method not implemented.");
    }
}