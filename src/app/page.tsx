"use client";

import { useEffect } from "react";
import MainComponent from "./components/MainComponent";
import { useAudioEditor } from "./context/AudioEditorContext";
import { useApplicationConfig } from "./context/ApplicationConfigContext";

const Home = () => {
    const { pauseAudioEditor } = useAudioEditor();
    const { updateCurrentTheme } = useApplicationConfig();

    useEffect(() => {
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            pauseAudioEditor();
            event.preventDefault();
            event.returnValue = "";
        };

        const handleThemeChange = () => updateCurrentTheme();

        window.addEventListener("beforeunload", handleBeforeUnload);
        window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", handleThemeChange);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
            window.matchMedia("(prefers-color-scheme: dark)").removeEventListener("change", handleThemeChange);
        };
    }, [pauseAudioEditor, updateCurrentTheme]);

    return <MainComponent></MainComponent>;
};

export default Home;
