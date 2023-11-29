"use client";

import { useEffect } from "react";
import MainComponent from "./components/MainComponent";
import { useAudioEditor } from "./context/AudioEditorContext";

const Home = () => {
    const { pauseAudioEditor } = useAudioEditor();

    useEffect(() => {
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            pauseAudioEditor();
            event.preventDefault();
            event.returnValue = "";
        };

        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [pauseAudioEditor]);

    return <MainComponent></MainComponent>;
};

export default Home;