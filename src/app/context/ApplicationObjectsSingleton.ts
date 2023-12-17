import AudioEditor from "../classes/AudioEditor";
import BufferPlayer from "../classes/BufferPlayer";
import EventEmitter from "../classes/EventEmitter";
import VoiceRecorder from "../classes/VoiceRecorder";
import Constants from "../model/Constants";
import ApplicationConfigService from "./ApplicationConfigService";

export default class ApplicationObjectsSingleton {

    private static audioEditor: AudioEditor | null = null;
    private static audioPlayer: BufferPlayer | null = null;
    private static audioRecorder: VoiceRecorder | null = null;
    private static eventEmitter: EventEmitter | null = null;
    private static applicationConfigService: ApplicationConfigService | null = null;
    private static ready = false;

    private constructor() {}

    private static initialize() {
        if (!ApplicationObjectsSingleton.ready) {
            const context = new AudioContext({
                latencyHint: "interactive"
            });

            const recorderContext = new AudioContext({
                latencyHint: "balanced"
            });

            const eventEmitter = new EventEmitter();
            const audioPlayer = new BufferPlayer(context, eventEmitter);
            const audioRecorder = new VoiceRecorder(recorderContext, eventEmitter);
            const configService = new ApplicationConfigService();

            ApplicationObjectsSingleton.audioEditor = new AudioEditor(context, audioPlayer, eventEmitter, configService, Constants.AUDIO_BUFFERS_TO_FETCH);
            ApplicationObjectsSingleton.audioPlayer = audioPlayer;
            ApplicationObjectsSingleton.audioRecorder = audioRecorder;
            ApplicationObjectsSingleton.eventEmitter = eventEmitter;
            ApplicationObjectsSingleton.applicationConfigService = configService;

            ApplicationObjectsSingleton.ready = true;
        }
    }

    static getAudioEditorInstance(): AudioEditor | null {
        ApplicationObjectsSingleton.initialize();
        return ApplicationObjectsSingleton.audioEditor;
    }

    static getAudioPlayerInstance(): BufferPlayer | null {
        ApplicationObjectsSingleton.initialize();
        return ApplicationObjectsSingleton.audioPlayer;
    }

    static getAudioRecorderInstance(): VoiceRecorder | null {
        ApplicationObjectsSingleton.initialize();
        return ApplicationObjectsSingleton.audioRecorder;
    }

    static getEventEmitterInstance(): EventEmitter | null {
        ApplicationObjectsSingleton.initialize();
        return ApplicationObjectsSingleton.eventEmitter;
    }

    static getConfigServiceInstance(): ApplicationConfigService | null {
        ApplicationObjectsSingleton.initialize();
        return ApplicationObjectsSingleton.applicationConfigService;
    }
}
