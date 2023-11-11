export default interface AudioConstraint {
    noiseSuppression?: boolean,
    echoCancellation?: boolean,
    autoGainControl?: boolean,
    deviceId?: string,
    groupId?: string
}