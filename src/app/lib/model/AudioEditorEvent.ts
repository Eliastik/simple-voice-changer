import { EventEmitterCallback } from "./EventEmitterCallback";

export default interface AudioEditorEvents {
    [key: string]: EventEmitterCallback[]
};
