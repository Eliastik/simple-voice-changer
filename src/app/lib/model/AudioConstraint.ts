export default interface AudioConstraint {
    [key: string]: string | boolean | undefined,
    noiseSuppression?: boolean,
    echoCancellation?: boolean,
    autoGainControl?: boolean,
    deviceId?: string,
    groupId?: string
};
