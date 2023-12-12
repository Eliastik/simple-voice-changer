import "./globals.css";
import { AudioEditorProvider } from "./context/AudioEditorContext";
import { ApplicationConfigProvider } from "./context/ApplicationConfigContext";
import { AudioPlayerProvider } from "./context/AudioPlayerContext";
import { AudioRecorderProvider } from "./context/AudioRecorderContext";
import LayoutChild from "./layoutChild";

export const metadata = {
    title: "Simple Voice Changer"
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
