"use client";

import { useEffect } from "react";
import MainComponent from "./components/MainComponent";
import { useAudioEditor } from "./context/AudioEditorContext";

const Home = () => {
  const { pauseAudioBuffer } = useAudioEditor();
  
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      pauseAudioBuffer();
      event.preventDefault();
      event.returnValue = '';
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return <MainComponent></MainComponent>
};

export default Home;