import * as soundtouch from "soundtocuchjs";

class AudioEditor {
    speed = 1;
    pitch = 1;
    reverb = false;
    comp = false;
    lowpass = false;
    highpass = false;
    bassboost = false;
    phone = false;
    returnAudioParam = false;
    echo = false;
    bitCrush = false;
    enableLimiter = false;
    rate = 1;
    BUFFER_SIZE = 4096;
    st = new soundtouch.SoundTouch(44100);
    soundtouchFilter = new soundtouch.SimpleFilter();
    soundtouchNode: any = null;
    context: AudioContext | null = null;

    connectNodes() {
        if('AudioContext' in window && this.context != null) {
            let previousSountouchNode = this.soundtouchNode;
            const buffer = audioBuffers.processed;
    
            // Soundtouch settings
            this.st.pitch = this.pitch;
            this.st.tempo = this.speed;
            this.st.rate = this.rate;
            this.soundtouchNode = soundtouch.getWebAudioNode(this.context, this.soundtouchFilter);
            this.soundtouchFilter.callback = () => this.soundtouchNode?.disconnect();
            let node = this.soundtouchNode;
            // End of Soundtouch settings
    
            // Disconnect all previous nodes
    
            // Gain node
            node.connect(gainNode);
            node = gainNode;
    
            // Connect other nodes
        }
    }
}