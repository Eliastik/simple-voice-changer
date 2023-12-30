interface RecorderWorkerData {
    command: string,
    data: Blob,
    buffer?: Float32Array[]
};

export default interface RecorderWorkerMessage {
    data: RecorderWorkerData,
};
