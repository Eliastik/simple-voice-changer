import AbstractAudioFilter from "./interfaces/AbstractAudioFilter";
import Constants from "../model/Constants";
import { ReverbEnvironment } from "../model/ReverbEnvironment";
import ReverbSettings from "../model/filtersSettings/ReverbSettings";
import GenericSettingValue from "../model/filtersSettings/GenericSettingValue";

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

    getAddingTime() {
        const settings = this.getSettings();

        if(settings && settings.reverbEnvironment && settings.reverbEnvironment.additionalData) {
            return settings.reverbEnvironment.additionalData.addDuration as number;
        }

        return 0;
    }

    getSettings(): ReverbSettings {
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

    async setSetting(settingId: string, value: GenericSettingValue) {
        if(settingId == "reverbEnvironment") {
            const url = value.value;

            try {
                await this.bufferFetcherService?.fetchBuffer(url);

                if(value.additionalData) {
                    this.reverbEnvironment = {
                        name: value.name,
                        url,
                        size: value.additionalData.size as number,
                        addDuration: value.additionalData.addDuration as number,
                        link: value.additionalData.link as string
                    };
                } else {
                    this.reverbEnvironment = {
                        name: value.name,
                        url,
                        size: 0,
                        addDuration: 0,
                        link: ""
                    };
                }
            } catch(e) { /* empty */ }
        }
    }
}
