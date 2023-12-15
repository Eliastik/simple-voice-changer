import AbstractAudioFilter from "../model/AbstractAudioFilter";
import Constants from "../model/Constants";
import { ReverbEnvironment } from "../model/ReverbEnvironment";

export default class ReverbFilter extends AbstractAudioFilter {
    private reverbEnvironment: ReverbEnvironment = Constants.DEFAULT_REVERB_ENVIRONMENT;

    getNode(context: BaseAudioContext) {
        const convolver = context.createConvolver();

        if(this.bufferFetcherService) {
            convolver.buffer = this.bufferFetcherService.getAudioBuffer(this.reverbEnvironment.url)!;
        }

        return {
            input: convolver,
            output: convolver
        };
    }
    
    get order(): number {
        return 9;
    }

    get id(): string {
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
            } catch(e) { /* empty */ }
        }
    }
}
