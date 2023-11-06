import AbstractAudioFilter from "../model/AbstractAudioFilter";

export default class PassThroughFilter extends AbstractAudioFilter {

    private gainNode: GainNode | undefined = undefined;

    constructor() {
        super();
    }

    getNode(context: BaseAudioContext) {
        if (!this.gainNode || context != this.gainNode.context) {
            this.gainNode = new GainNode(context);
        }

        return {
            input: this.gainNode,
            output: this.gainNode,
        };
    }

    getOrder(): number {
        return Number.MAX_SAFE_INTEGER;
    }

    getId(): string {
        return "passthroughfilter";
    }

    getSettings() {
        return {};
    }

    isEnabled(): boolean {
        return true;
    }

    async setSetting(settingId: string, value: string) { }
}