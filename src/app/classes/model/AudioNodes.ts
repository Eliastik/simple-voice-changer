interface AudioFilterNodes {
    input: AudioNode;
    output: AudioNode;
    lastNode?: AudioFilterNodes | undefined;
    intermediateNodes?: AudioFilterNodes[]
}