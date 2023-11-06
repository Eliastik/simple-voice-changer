interface AudioFilterNodes {
    input: AudioNode;
    output: AudioNode;
    intermediateNodes?: AudioFilterNodes[]
}