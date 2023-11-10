import AudioEditor from "../classes/AudioEditor";
import BufferPlayer from "../classes/BufferPlayer";
import EventEmitter from "../classes/EventEmitter";
import VoiceRecorder from "../classes/VoiceRecorder";
import Constants from "../model/Constants";

export default class AudioObjectsSingleton {

    private static audioEditor: AudioEditor | null = null;
    private static audioPlayer: BufferPlayer | null = null;
    private static audioRecorder: VoiceRecorder | null = null;
    private static eventEmitter: EventEmitter | null = null;
    private static ready = false;

    private constructor() {}

    private static initialize() {
        if (!AudioObjectsSingleton.ready) {
            const context = new AudioContext();
            const eventEmitter = new EventEmitter();
            const audioPlayer = new BufferPlayer(context, eventEmitter);
            const audioRecorder = new VoiceRecorder(context, eventEmitter);

            AudioObjectsSingleton.audioEditor = new AudioEditor(context, audioPlayer, eventEmitter, Constants.audioBuffersToFetch);
            AudioObjectsSingleton.audioPlayer = audioPlayer;
            AudioObjectsSingleton.audioRecorder = audioRecorder;
            AudioObjectsSingleton.eventEmitter = eventEmitter;

            AudioObjectsSingleton.ready = true;
        }
    }

    static getAudioEditorInstance(): AudioEditor | null {
        AudioObjectsSingleton.initialize();
        return AudioObjectsSingleton.audioEditor;
    }

    static getAudioPlayerInstance(): BufferPlayer | null {
        AudioObjectsSingleton.initialize();
        return AudioObjectsSingleton.audioPlayer;
    }

    static getAudioRecorderInstance(): VoiceRecorder | null {
        AudioObjectsSingleton.initialize();
        return AudioObjectsSingleton.audioRecorder;
    }

    static getEventEmitterInstance(): EventEmitter | null {
        AudioObjectsSingleton.initialize();
        return AudioObjectsSingleton.eventEmitter;
    }
}