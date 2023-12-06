//@ts-ignore
import { PitchShifter } from "soundtouchjs";
import Constants from "../model/Constants";
import AbstractAudioFilterWorklet from "../model/AbstractAudioFilterWorklet";
import AudioFilterEntrypointInterface from "../model/AudioFilterEntrypointInterface";
import { AudioFilterNodes } from "../model/AudioNodes";
import utils from "../utils/Functions";
import SoundtouchWrapperFilterWorkletNode from "./SoundtouchWrapperFilterWorkletNode";

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

    async getEntrypointNode(context: BaseAudioContext, buffer: AudioBuffer, offline: boolean): Promise<AudioFilterNodes> {
        this.isOfflineMode = offline;

        // In offline (compatibility) mode
        if(offline) {
            // If the settings are untouched, we don't use Soundtouch
            if(this.speedAudio == 1 && this.frequencyAudio == 1) {
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
                if(Constants.ENABLE_SOUNDTOUCH_AUDIO_WORKLET && this.speedAudio == 1) {
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
        const durationAudio = utils.calcAudioDuration(buffer, 1, false, 0, false);
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
        const durationAudio = utils.calcAudioDuration(buffer, 1, false, 0, false);
        const offlineContext = new OfflineAudioContext(2, context.sampleRate * durationAudio, context.sampleRate);

        try {
            // Stop current worklet
            if(this.currentPitchShifterWorklet) {
                this.currentPitchShifterWorklet.stop();
            }

            // Setup worklet JS module
            await offlineContext.audioWorklet.addModule(Constants.WORKLET_PATHS.SOUNDTOUCH);
    
            // Setup an audio buffer source from the audio buffer
            const bufferSource = offlineContext.createBufferSource();
            bufferSource.buffer = buffer;
            bufferSource.start();
    
            // Create the worklet node
            this.currentPitchShifterWorklet = new SoundtouchWrapperFilterWorkletNode(offlineContext, "soundtouch-worklet", {
                processorOptions: {
                    bypass: false,
                    recording: false,
                    nInputFrames: durationAudio * context.sampleRate,
                    updateInterval: 10.0,
                    sampleRate: context.sampleRate
                },
            });
    
            // Connect the node for correct rendering
            bufferSource.connect(this.currentPitchShifterWorklet.node);
            this.currentPitchShifterWorklet.node.connect(offlineContext.destination);

            // Setup pitch/speed of Soundtouch
            await this.currentPitchShifterWorklet.setup(this.speedAudio, this.frequencyAudio);
            
            // Start rendering, then when rendering is finished, returns the rendered buffer as a buffer source
            const renderedBuffer = await offlineContext.startRendering();

            const bufferSourceRendered = context.createBufferSource();
            bufferSourceRendered.buffer = renderedBuffer;
            bufferSourceRendered.start();

            return {
                input: bufferSourceRendered,
                output: bufferSourceRendered
            };
        } catch(e) {
            // Fallback to script processor node
            console.error(e);
            return this.renderWithScriptProcessorNode(buffer, context);
        }
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
        if(this.isOfflineMode) {
            // If the settings are untouched, we don't use Soundtouch
            if(this.speedAudio == 1 && this.frequencyAudio == 1) {
                return null;
            } else {
                if(Constants.ENABLE_SOUNDTOUCH_AUDIO_WORKLET && this.speedAudio == 1) {
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
