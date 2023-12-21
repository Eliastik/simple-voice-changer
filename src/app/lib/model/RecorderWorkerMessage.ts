interface RecorderWorkerData {
    command: string,
    data: Blob
};

export default interface RecorderWorkerMessage {
    data: RecorderWorkerData,
    
};
