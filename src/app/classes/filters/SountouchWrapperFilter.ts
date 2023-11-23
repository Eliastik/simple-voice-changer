//@ts-ignore
import { createScheduledSoundTouchNode } from "@dancecuts/soundtouchjs-scheduled-audio-worklet";
import Constants from "../model/Constants";
import AbstractAudioFilterWorklet from "../model/AbstractAudioFilterWorklet";
import AudioFilterEntrypointInterface from "../model/AudioFilterEntrypointInterface";

export default class SoundtouchWrapperFilter extends AbstractAudioFilterWorklet implements AudioFilterEntrypointInterface {

    private speedAudio = 1;
    private frequencyAudio = 1;
    private currentSpeedAudio = 1;
    private currentPitchShifter: any;

    constructor() {
        super();
        this.enable();
        this.setDefaultEnabled(true);
    }

    async initializeWorklet(audioContext: BaseAudioContext): Promise<void> {
        await audioContext.audioWorklet.addModule(Constants.WORKLET_PATHS.SOUNDTOUCH);
    }

    async getEntrypointNode(context: BaseAudioContext, buffer: AudioBuffer): Promise<AudioFilterNodes> {
        return new Promise(resolve => {
            if(this.currentPitchShifter) {
                this.currentPitchShifter.stop();
            }
    
            this.currentPitchShifter = createScheduledSoundTouchNode(context, buffer);
    
            this.currentPitchShifter.onInitialized = () => {
                this.currentPitchShifter.start();
                this.updateState();

                resolve({
                    input: this.currentPitchShifter,
                    output: this.currentPitchShifter
                })
            };
        });
    }
    
    getNode(context: BaseAudioContext): AudioFilterNodes {
        throw new Error("Method not implemented.");
    }
    
    getOrder(): number {
        return 2;
    }

    getId(): string {
        return Constants.FILTERS_NAMES.SOUNDTOUCH;
    }

    getSettings() {
        return {
            speedAudio: this.speedAudio,
            frequencyAudio: this.frequencyAudio
        };
    }

    updateState(): void {
        if(this.currentPitchShifter) {
            if(this.isEnabled()) {
                this.currentPitchShifter.tempo = this.speedAudio;
                this.currentSpeedAudio = this.speedAudio;
            } else {
                this.currentPitchShifter.tempo = 1;
                this.currentSpeedAudio = 1;
            }
    
            if(this.isEnabled()) {
                this.currentPitchShifter.pitch = this.frequencyAudio;
            } else {
                this.currentPitchShifter.pitch = 1;
            }
        }
    }

    async setSetting(settingId: string, value: string) {
        if(!value || value == "" || isNaN(Number(value))) {
            return;
        }

        const valueFloat = parseFloat(value);

        switch(settingId) {
            case "speedAudio":
                this.speedAudio = valueFloat;
                break;
            case "frequencyAudio":
                this.frequencyAudio = valueFloat;
                break;
            default:
                break;
        }

        this.updateState();
    }

    getSpeed(): number {
        return this.currentSpeedAudio;
    }
}