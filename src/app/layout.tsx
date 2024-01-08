import "./globals.css";
import { AudioEditorProvider } from "@eliastik/simple-sound-studio-components/lib";
import { ApplicationConfigProvider } from "./context/ApplicationConfigContext";
import { AudioPlayerProvider } from "./context/AudioPlayerContext";
import { AudioRecorderProvider } from "./context/AudioRecorderContext";
import LayoutChild from "./layoutChild";
import Constants from "./model/Constants";

export const metadata = {
    title: Constants.APP_NAME
};

const RootLayout = ({
    children,
}: { children: React.ReactNode }) => {
    return (
        <AudioEditorProvider>
            <AudioPlayerProvider>
                <AudioRecorderProvider>
                    <ApplicationConfigProvider>
                        <LayoutChild>{children}</LayoutChild>
                    </ApplicationConfigProvider>
                </AudioRecorderProvider>
            </AudioPlayerProvider>
        </AudioEditorProvider>
    );
};

export default RootLayout;
