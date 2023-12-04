//@ts-ignore
import { createScheduledSoundTouchNode } from "@eliastik/soundtouchjs-audio-worklet";
//@ts-ignore
import { PitchShifter } from "soundtouchjs";
import Constants from "../model/Constants";
import AbstractAudioFilterWorklet from "../model/AbstractAudioFilterWorklet";
import AudioFilterEntrypointInterface from "../model/AudioFilterEntrypointInterface";
import { AudioFilterNodes } from "../model/AudioNodes";

export default class SoundtouchWrapperFilter extends AbstractAudioFilterWorklet implements AudioFilterEntrypointInterface {

    private speedAudio = 1;
    private frequencyAudio = 1;
    private currentSpeedAudio = 1;
    private currentPitchShifterWorklet: any;
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
            if(Constants.ENABLE_SOUNDTOUCH_AUDIO_WORKLET) {
                if(this.currentPitchShifterWorklet) {
                    this.currentPitchShifterWorklet.stop();
                    this.currentPitchShifterWorklet.disconnect();
                }
            
                this.currentPitchShifterWorklet = createScheduledSoundTouchNode(context, buffer);
            
                this.currentPitchShifterWorklet.onInitialized = () => {
                    this.currentPitchShifterWorklet.start();
                    this.updateState();
        
                    resolve({
                        input: this.currentPitchShifterWorklet,
                        output: this.currentPitchShifterWorklet
                    });
                };
            } else {
                if(this.currentPitchShifter) {
                    this.currentPitchShifter.disconnect();
                }
        
                this.currentPitchShifter = new PitchShifter(context, buffer, Constants.SOUNDTOUCH_PITCH_SHIFTER_BUFFER_SIZE);
                this.updateState();
        
                resolve({
                    input: this.currentPitchShifter,
                    output: this.currentPitchShifter
                });
            }
        });
    }
    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

    private getCurrentPitchShifter() {
        if(Constants.ENABLE_SOUNDTOUCH_AUDIO_WORKLET) {
            return this.currentPitchShifterWorklet;
        }

        return this.currentPitchShifter;
    }

    updateState(): void {
        const pitchShifter = this.getCurrentPitchShifter();

        if(pitchShifter) {
            if(this.isEnabled()) {
                pitchShifter.tempo = this.speedAudio;
                this.currentSpeedAudio = this.speedAudio;
            } else {
                pitchShifter.tempo = 1;
                this.currentSpeedAudio = 1;
            }
    
            if(this.isEnabled()) {
                pitchShifter.pitch = this.frequencyAudio;
            } else {
                pitchShifter.pitch = 1;
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
