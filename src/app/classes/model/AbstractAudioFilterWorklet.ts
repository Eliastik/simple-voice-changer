import WorkletScriptProcessorNodeAdapter from "../utils/WorkletScriptProcessorNodeAdapter";
import AbstractAudioFilter from "./AbstractAudioFilter";
import Constants from "./Constants";
import SimpleAudioWorkletProcessor from "./SimpleAudioWorkletProcessor";
import "../utils/AudioWorkletProcessorPolyfill";

export default abstract class AbstractAudioFilterWorklet extends AbstractAudioFilter {

    protected currentWorkletNode: AudioWorkletNode | WorkletScriptProcessorNodeAdapter | null = null;
    protected fallbackToScriptProcessor = false;

    /**
     * Construct the AudioWorkletPrcossor that will be used to fallback to ScriptProcessorNode
     */
    abstract constructAudioWorkletProcessor(): SimpleAudioWorkletProcessor;

    /**
     * Return the worklet name (as registered with method registerProcessor)
     */
    abstract get workletName(): string;

    /**
     * Return the path to worklet file
     */
    abstract get workletPath(): string;

    /**
     * Initialize the audio worklet by loading the module
     * @param audioContext The audio context
     */
    async initializeWorklet(audioContext: BaseAudioContext): Promise<void> {
        if(!this.isAudioWorkletCompatible(audioContext)) {
            console.error("Audio Worklets not supported on this browser. Fallback to ScriptProcessor");
            this.fallbackToScriptProcessor = true;
        }

        await audioContext.audioWorklet.addModule(this.workletPath)
            .catch(e => {
                console.error(`Error when loading Worklet (${this.workletPath}) for filter ${this.id}. Fallback to ScriptProcessor. Exception:`, e);
                this.fallbackToScriptProcessor = true;
            });
    }

    /**
     * This method checks if the browser is compatible with audio worklets
     * @param audioContext 
     */
    protected isAudioWorkletCompatible(audioContext: BaseAudioContext) {
        if (typeof (audioContext) !== "undefined" && typeof (audioContext.audioWorklet) !== "undefined") {
            return true;
        }

        return false;
    }

    /**
     * This method checks if audio worklet are enabled
     * @param audioContext 
     */
    protected isAudioWorkletEnabled() {
        if(this.configService) {
            return this.configService.getConfig(Constants.PREFERENCES_KEYS.ENABLE_AUDIO_WORKLET) == "true"
                || Constants.ENABLE_AUDIO_WORKLET;
        }

        return Constants.ENABLE_AUDIO_WORKLET;
    }

    /**
     * Initialize the AudioWorkletNode or fallback to ScriptProcessorNode
     * @param context The audio context
     * @param workletName The worklet name
     */
    private initializeNode(context: BaseAudioContext, workletName: string) {
        if (this.isAudioWorkletEnabled() && !this.fallbackToScriptProcessor) {
            this.currentWorkletNode = new AudioWorkletNode(context, workletName);
        } else {
            this.currentWorkletNode = new WorkletScriptProcessorNodeAdapter(context, this.constructAudioWorkletProcessor());
        }
    }

    /**
     * Apply current settings to the audio worklet node.
     * Uses the getSettings method to extract the settings.
     */
    protected applyCurrentSettingsToWorklet() {
        if (this.currentWorkletNode && this.currentWorkletNode.parameters) {
            const currentSettings = this.getSettings();

            for (const settingKey of Object.keys(currentSettings)) {
                const settingFromWorklet = this.currentWorkletNode.parameters.get(settingKey);

                if (settingFromWorklet) {
                    settingFromWorklet.value = currentSettings[settingKey];
                    settingFromWorklet.setValueAtTime(currentSettings[settingKey], 0);
                }
            }
        }
    }

    /** Default implementation for GetNode - AbstractAudioFilterWorklet */
    getNode(context: BaseAudioContext) {
        this.stop();

        this.initializeNode(context, this.workletName);
        this.applyCurrentSettingsToWorklet();

        if (this.currentWorkletNode) {
            if (this.currentWorkletNode instanceof WorkletScriptProcessorNodeAdapter) {
                return {
                    input: this.currentWorkletNode.node!,
                    output: this.currentWorkletNode.node!,
                };
            } else {
                return {
                    input: this.currentWorkletNode,
                    output: this.currentWorkletNode,
                };
            }
        }

        throw new Error("Worklet node has not yet been created");
    }

    /**
     * Stop the current worklet node. The worklet need to respond to "stop" events.
     */
    stop() {
        if (this.currentWorkletNode && this.currentWorkletNode.port) {
            this.currentWorkletNode.port.postMessage("stop");
        }
    }

    public isWorklet(): boolean {
        return true;
    }
}
