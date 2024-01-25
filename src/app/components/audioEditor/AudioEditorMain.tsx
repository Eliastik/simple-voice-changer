"use client";

import { AudioEditorActionButtons, FilterButtonList, AudioEditorDialogs, AudioEditorNotifications } from "@eliastik/simple-sound-studio-components";
import AudioPlayer from "./AudioPlayer";

const AudioEditorMain = () => {

    return (
        <>
            <AudioEditorNotifications></AudioEditorNotifications>
            <div className="flex justify-center items-center flex-grow gap-6 flex-col pt-16 pb-16">
                <div className="grid lg:grid-cols-6 md:grid-cols-4 grid-cols-3 md:gap-4 gap-2 place-content-center p-2 md:mt-2 md:p-0">
                    <FilterButtonList></FilterButtonList>
                </div>
                <div className="flex flex-row md:gap-x-3 gap-x-1 sticky bottom-20 max-w-full flex-wrap justify-center gap-y-1">
                    <AudioEditorActionButtons></AudioEditorActionButtons>
                </div>
            </div>
            <AudioPlayer></AudioPlayer>
            <AudioEditorDialogs></AudioEditorDialogs>
        </>
    );
};

export default AudioEditorMain;
