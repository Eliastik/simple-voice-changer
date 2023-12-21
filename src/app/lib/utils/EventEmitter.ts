import AudioEditorEvents from "../model/AudioEditorEvent";
import { EventEmitterCallback } from "../model/EventEmitterCallback";

class EventEmitter {
    listeners: AudioEditorEvents = {};
    
    constructor() {
        this.listeners = {};
    }

    on(event: string, callback: EventEmitterCallback) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
    }

    emit(event: string, data?: string | number | AudioBuffer) {
        if (this.listeners[event]) {
            this.listeners[event].forEach(callback => {
                callback(data);
            });
        }
    }

    off(event: string, callback: EventEmitterCallback) {
        if (this.listeners[event]) {
            this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
        }
    }
}

export default EventEmitter;
