//@ts-ignore
import { PitchShifter } from "soundtouchjs";
import Constants from "../model/Constants";
import AbstractAudioFilterWorklet from "./interfaces/AbstractAudioFilterWorklet";
import AudioFilterEntrypointInterface from "./interfaces/AudioFilterEntrypointInterface";
import { AudioFilterNodes } from "../model/AudioNodes";
import utils from "../utils/Functions";
import SoundtouchWrapperFilterWorkletNode from "./worklets/SoundtouchWrapperFilterWorkletNode";
import SimpleAudioWorkletProcessor from "../workletPolyfill/SimpleAudioWorkletProcessor";

export default class SoundtouchWrapperFilter extends AbstractAudioFilterWorklet implements AudioFilterEntrypointInterface {

    private speedAudio = 1;
    private frequencyAudio = 1;
    private currentSpeedAudio = 1;
    private currentPitchShifterWorklet: any;
    private currentPitchShifter: any;
    private isOfflineMode = false;

    constructor() {
        super();
        this.enable();
        this.setDefaultEnabled(true);
    }

    async initializeWorklet(audioContext: BaseAudioContext): Promise<void> {
        // Do nothing
    }

    get workletPath(): string {
        return Constants.WORKLET_PATHS.SOUNDTOUCH;
    }

    constructAudioWorkletProcessor(): SimpleAudioWorkletProcessor {
        throw new Error("Method not implemented.");
    }

    get workletName(): string {
        return Constants.WORKLET_NAMES.SOUNDTOUCH;
    }

    async getEntrypointNode(context: BaseAudioContext, buffer: AudioBuffer, offline: boolean): Promise<AudioFilterNodes> {
        this.isOfflineMode = offline;

        // In offline (compatibility) mode
        if(offline) {
            // If the settings are untouched, we don't use Soundtouch
            if(!this.isEnabled() || (this.speedAudio == 1 && this.frequencyAudio == 1)) {
                // Just return an audio buffer source node
                const bufferSource = context.createBufferSource();
                bufferSource.buffer = buffer;
                bufferSource.start();

                return {
                    input: bufferSource,
                    output: bufferSource
                };
            } else {
                // If audio worklet is enabled for soundtouch, and if the speed of audio is untouched
                // Soundtouch Audio Worklet don't support speed editing yet
                if(this.isAudioWorkletEnabled() && this.isAudioWorkletCompatible(context) && this.speedAudio == 1) {
                    return this.renderWithWorklet(buffer, context);
                } else {
                    return this.renderWithScriptProcessorNode(buffer, context);
                }
            }
        }

        // Not in offline mode: get classic soundtouch script processor node
        if (this.currentPitchShifter) {
            this.currentPitchShifter.disconnect();
        }

        this.currentPitchShifter = this.getSoundtouchScriptProcessorNode(buffer, context);
        this.updateState();

        return {
            input: this.currentPitchShifter,
            output: this.currentPitchShifter
        };
    }

    private getSoundtouchScriptProcessorNode(buffer: AudioBuffer, context: BaseAudioContext): AudioNode {
        return new PitchShifter(context, buffer, Constants.SOUNDTOUCH_PITCH_SHIFTER_BUFFER_SIZE);
    }

    /**
     * Use script processor node (deprecated) to render the audio buffer with Soundtouch, according to the current settings.
     * Not working on Firefox
     * @param buffer Audio buffer
     * @param context Audio context
     * @returns A promise resolving to audio nodes with the rendered audio as a buffer source
     */
    private async renderWithScriptProcessorNode(buffer: AudioBuffer, context: BaseAudioContext): Promise<AudioFilterNodes> {
        const durationAudio = utils.calcAudioDuration(buffer, this.speedAudio);
        const offlineContext = new OfflineAudioContext(2, context.sampleRate * durationAudio, context.sampleRate);

        if (this.currentPitchShifter) {
            this.currentPitchShifter.disconnect();
        }

        this.currentPitchShifter = this.getSoundtouchScriptProcessorNode(buffer, offlineContext);
        this.updateState();
        
        this.currentPitchShifter.connect(offlineContext.destination);

        const renderedBuffer = await offlineContext.startRendering();

        const bufferSourceRendered = context.createBufferSource();
        bufferSourceRendered.buffer = renderedBuffer;
        bufferSourceRendered.start();

        return {
            input: bufferSourceRendered,
            output: bufferSourceRendered
        };
    }

    /**
     * EXPERIMENTAL - Use audio worklet to render the audio buffer with Soundtouch, according to the current settings.
     * Working in Firefox and Chrome
     * @param buffer Audio buffer
     * @param context Audio context
     * @returns A promise resolving to audio nodes with the rendered audio as a buffer source
     */
    private async renderWithWorklet(buffer: AudioBuffer, context: BaseAudioContext): Promise<AudioFilterNodes> {
        const durationAudio = utils.calcAudioDuration(buffer, this.speedAudio);

        try {
            // Stop current worklet
            if(this.currentPitchShifterWorklet) {
                this.currentPitchShifterWorklet.stop();
            }

            // Setup worklet JS module
            await context.audioWorklet.addModule(Constants.WORKLET_PATHS.SOUNDTOUCH);
    
            // Setup an audio buffer source from the audio buffer
            const bufferSource = context.createBufferSource();
            bufferSource.buffer = buffer;
            bufferSource.start();
    
            // Create the worklet node
            this.currentPitchShifterWorklet = new SoundtouchWrapperFilterWorkletNode(context, "soundtouch-worklet", {
                processorOptions: {
                    bypass: false,
                    recording: false,
                    nInputFrames: this.approximateNInputFrames(durationAudio, context),
                    updateInterval: 10.0,
                    sampleRate: context.sampleRate
                },
            });
    
            // Connect the node for correct rendering
            bufferSource.connect(this.currentPitchShifterWorklet.node);

            // Setup pitch/speed of Soundtouch
            if(this.isEnabled()) {
                await this.currentPitchShifterWorklet.setup(this.speedAudio, this.frequencyAudio);
            } else {
                await this.currentPitchShifterWorklet.setup(1, 1);
            }

            return {
                input: this.currentPitchShifterWorklet,
                output: this.currentPitchShifterWorklet
            };
        } catch(e) {
            // Fallback to script processor node
            console.error(e);
            return this.renderWithScriptProcessorNode(buffer, context);
        }
    }

    private approximateNInputFrames(durationAudio: number, context: BaseAudioContext) {
        // {frequencyAudio, multiplicator}: {{0.1, 10}, {0.2, 5}, {0.3, 3.33}, {0.4, 2.5}, {0.5, 2}, {0.6, 1.67}, {0.7, 1.43}, {0.8, 1.25}, {0.9, 1.11}, {1, 1}}
        return durationAudio * context.sampleRate * (Math.round(14 * Math.exp(-4 * this.frequencyAudio)) + 1);
    }
    
    get order(): number {
        return 2;
    }

    get id(): string {
        return Constants.FILTERS_NAMES.SOUNDTOUCH;
    }

    getSettings() {
        return {
            speedAudio: this.speedAudio,
            frequencyAudio: this.frequencyAudio
        };
    }

    protected isAudioWorkletEnabled() {
        if(this.configService) {
            return this.configService.isSoundtouchAudioWorkletEnabled();
        }

        return Constants.ENABLE_SOUNDTOUCH_AUDIO_WORKLET;
    }

    private getCurrentPitchShifter() {
        if(this.isOfflineMode) {
            // If the settings are untouched, we don't use Soundtouch
            if(this.speedAudio == 1 && this.frequencyAudio == 1) {
                return null;
            } else {
                if(this.isAudioWorkletEnabled() && this.currentPitchShifterWorklet && this.speedAudio == 1) {
                    return this.currentPitchShifterWorklet;
                } else {
                    return this.currentPitchShifter;
                }
            }
        }

        return this.currentPitchShifter;
    }

    updateState(): void {
        const pitchShifter = this.getCurrentPitchShifter();

        if(!this.isEnabled()) {
            if(pitchShifter) {
                pitchShifter.pitch = 1;
                pitchShifter.tempo = 1;
            }
                
            this.currentSpeedAudio = 1;
        } else {
            if(pitchShifter) {
                pitchShifter.pitch = this.frequencyAudio;
                pitchShifter.tempo = this.speedAudio;
            }
            
            this.currentSpeedAudio = this.speedAudio;
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

    setEnabled(state: boolean): void {
        super.setEnabled(state);
        this.updateState();
    }

    getSpeed(): number {
        return this.currentSpeedAudio;
    }
}
