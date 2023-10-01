import AbstractAudioFilter from "../AbstractAudioFilter";

export default class Echo extends AbstractAudioFilter {
    delay = 0.2;
    gain = 0.75;

    constructor(delay: number, gain: number) {
        super();
        this.delay = delay;
        this.gain = gain;
    }

    render(): JSX.Element {
        throw new Error("Method not implemented.");
    }

    getNode(context: AudioContext): AudioFilterNodes {
        const delayNode = context.createDelay(179);
        delayNode.delayTime.value = this.delay;

        const gainNode = context.createGain();
        gainNode.gain.value = this.gain;

        gainNode.connect(delayNode);
        delayNode.connect(gainNode);

        return {
            input: gainNode,
            output: delayNode
        };
    }
}