import AudioEditor from "../classes/AudioEditor";
import BufferPlayer from "../classes/BufferPlayer";
import EventEmitter from "../classes/EventEmitter";
import Constants from "../model/Constants";

export default class AudioEditorPlayerSingleton {

    private static audioEditor: AudioEditor | null = null;
    private static audioPlayer: BufferPlayer | null = null;
    private static eventEmitter: EventEmitter | null = null;

    private constructor() {}

    private static initialize() {
        if (AudioEditorPlayerSingleton.audioEditor == null
            && AudioEditorPlayerSingleton.audioPlayer == null && AudioEditorPlayerSingleton.eventEmitter == null) {
            const context = new AudioContext();
            const eventEmitter = new EventEmitter();
            const audioPlayer = new BufferPlayer(context, eventEmitter);

            AudioEditorPlayerSingleton.audioEditor = new AudioEditor(context, audioPlayer, eventEmitter, Constants.audioBuffersToFetch);
            AudioEditorPlayerSingleton.audioPlayer = audioPlayer;
            AudioEditorPlayerSingleton.eventEmitter = eventEmitter;
        }
    }

    static getAudioEditorInstance(): AudioEditor | null {
        AudioEditorPlayerSingleton.initialize();
        return AudioEditorPlayerSingleton.audioEditor;
    }

    static getAudioPlayerInstance(): BufferPlayer | null {
        AudioEditorPlayerSingleton.initialize();
        return AudioEditorPlayerSingleton.audioPlayer;
    }

    static getEventEmitterInstance(): EventEmitter | null {
        AudioEditorPlayerSingleton.initialize();
        return AudioEditorPlayerSingleton.eventEmitter;
    }
}