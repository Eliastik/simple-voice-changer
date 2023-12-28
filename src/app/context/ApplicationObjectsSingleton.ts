import AudioEditor from "../lib/AudioEditor";
import BufferPlayer from "../lib/BufferPlayer";
import EventEmitter from "../lib/utils/EventEmitter";
import VoiceRecorder from "../lib/VoiceRecorder";
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
            const eventEmitter = new EventEmitter();
            const configService = new ApplicationConfigService();

            const audioPlayer = new BufferPlayer(null, eventEmitter);
            const audioRecorder = new VoiceRecorder(null, eventEmitter, configService);

            ApplicationObjectsSingleton.audioEditor = new AudioEditor(null, audioPlayer, eventEmitter, configService, Constants.AUDIO_BUFFERS_TO_FETCH);
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
