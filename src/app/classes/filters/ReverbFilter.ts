import AbstractAudioFilter from "../model/AbstractAudioFilter";
import { ReverbEnvironment } from "../model/ReverbEnvironment";

export default class ReverbFilter extends AbstractAudioFilter {
    private currentBuffer: AudioBuffer | null = null;
    private buffers: Map<string, AudioBuffer> = new Map<string, AudioBuffer>();
    private reverbEnvironment: ReverbEnvironment = {
        name: "Medium Damping Cave E002 M2S",
        url: "assets/sounds/impulse_response.wav",
        size: 1350278,
        addDuration: 4,
        link: "http://www.cksde.com/p_6_250.htm",
        downloaded: false
    };

    getNode(context: BaseAudioContext): AudioFilterNodes {
        const convolver = context.createConvolver();
        convolver.buffer = this.currentBuffer;

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
        if(!this.reverbEnvironment) {
            return {};
        }

        return {
            reverbEnvironment: {
                name: this.reverbEnvironment.name,
                value: this.reverbEnvironment.url,
                additionalData: {
                    size: this.reverbEnvironment.size,
                    link: this.reverbEnvironment.link,
                    addDuration: this.reverbEnvironment.addDuration,
                    downloaded: this.buffers.get(this.reverbEnvironment.url) != null
                }
            }
        };
    }

    setSetting(settingId: string, value: any): void {
        if(settingId == "reverbEnvironment") {
            this.reverbEnvironment = {
                name: value.name,
                url: value.value,
                size: value.additionalData.size,
                addDuration: value.additionalData.addDuration,
                link: value.additionalData.link,
                downloaded: this.buffers.get(value.value) != null
            };
        }

        // TODO download buffer
    }
}