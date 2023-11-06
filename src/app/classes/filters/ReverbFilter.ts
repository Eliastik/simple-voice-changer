import AbstractAudioFilter from "../model/AbstractAudioFilter";
import { ReverbEnvironment } from "../model/ReverbEnvironment";

export default class ReverbFilter extends AbstractAudioFilter {
    private reverbEnvironment: ReverbEnvironment = {
        name: "Medium Damping Cave E002 M2S",
        url: "static/sounds/impulse_response.wav",
        size: 1350278,
        addDuration: 4,
        link: "http://www.cksde.com/p_6_250.htm"
    };

    getNode(context: BaseAudioContext): AudioFilterNodes {
        const convolver = context.createConvolver();
        convolver.buffer = this.bufferFetcherService?.getAudioBuffer(this.reverbEnvironment.url)!;

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
                    addDuration: this.reverbEnvironment.addDuration
                }
            },
            downloadedBuffers: this.bufferFetcherService?.getDownloadedBuffersList()
        };
    }

    async setSetting(settingId: string, value: any) {
        if(settingId == "reverbEnvironment") {
            this.reverbEnvironment = {
                name: value.name,
                url: value.value,
                size: value.additionalData.size,
                addDuration: value.additionalData.addDuration,
                link: value.additionalData.link
            };

            await this.bufferFetcherService?.fetchBuffer(this.reverbEnvironment.url);
        }
    }
}