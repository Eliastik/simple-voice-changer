"use client";

import LoadingAudioProcessingDialog from "../dialogs/LoadingAudioProcessingDialog";
import DownloadingBufferDialog from "../dialogs/DownloadingBufferDialog";
import { useTranslation } from "react-i18next";
import { useAudioRecorder } from "@/app/context/AudioRecorderContext";
import { useEffect } from "react";

const AudioRecorderMain = ({ }) => {
  const { audioRecorderReady, audioRecorderHasError } = useAudioRecorder();
  const { t } = useTranslation();

  return (
    <>
      <div className="toast toast-top toast-center"></div>
      <div className="flex justify-center items-center flex-grow gap-6 flex-col pt-20 pb-20">sdfsdf</div>
    </>
  )
};

export default AudioRecorderMain;