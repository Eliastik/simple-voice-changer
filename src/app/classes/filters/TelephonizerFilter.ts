import AbstractFilter from "../AbstractAudioFilter";

export default class BitCrusherFilter extends AbstractFilter {

    getNode(context: BaseAudioContext): AudioFilterNodes {
        const lpf1 = context.createBiquadFilter();
        lpf1.type = "lowpass";
        lpf1.frequency.value = 2000.0;
        const lpf2 = context.createBiquadFilter();
        lpf2.type = "lowpass";
        lpf2.frequency.value = 2000.0;
        const hpf1 = context.createBiquadFilter();
        hpf1.type = "highpass";
        hpf1.frequency.value = 500.0;
        const hpf2 = context.createBiquadFilter();
        hpf2.type = "highpass";
        hpf2.frequency.value = 500.0;
        lpf1.connect(lpf2);
        lpf2.connect(hpf1);
        hpf1.connect(hpf2);
    
        return {
            input: lpf1,
            output: hpf2
        };
    }
    
    getOrder(): number {
        return 7;
    }
}