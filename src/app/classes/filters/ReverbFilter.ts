import AbstractAudioFilter from "../model/AbstractAudioFilter";
import Constants from "../model/Constants";
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
        return Constants.FILTERS_NAMES.REVERB;
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
            const url = value.value;

            try {
                await this.bufferFetcherService?.fetchBuffer(url);

                this.reverbEnvironment = {
                    name: value.name,
                    url,
                    size: value.additionalData.size,
                    addDuration: value.additionalData.addDuration,
                    link: value.additionalData.link
                };
            } catch(e) { }
        }
    }
}