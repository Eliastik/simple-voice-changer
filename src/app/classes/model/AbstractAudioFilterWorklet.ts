import AbstractAudioFilter from "./AbstractAudioFilter";

export default abstract class AbstractAudioFilterWorklet extends AbstractAudioFilter {

    protected currentWorkletNode: AudioWorkletNode | null = null;

    abstract initializeWorklet(audioContext: BaseAudioContext): Promise<void>;

    /**
     * Apply current settings to the audio worklet node.
     * Uses the getSettings method to extract the settings.
     */
    protected applyCurrentSettingsToWorklet() {
        if(this.currentWorkletNode && this.currentWorkletNode.parameters) {
            const currentSettings = this.getSettings();

            for(const settingKey of Object.keys(currentSettings)) {
                const settingFromWorklet = this.currentWorkletNode.parameters.get(settingKey);

                if(settingFromWorklet) {
                    settingFromWorklet.value = currentSettings[settingKey];
                    settingFromWorklet.setValueAtTime(currentSettings[settingKey], 0);
                }
            }
        }
    }

    public isWorklet(): boolean {
        return true;
    }
}