import "./globals.css";
import { AudioEditorProvider } from "./context/AudioEditorContext";
import { ApplicationConfigProvider } from './context/ApplicationConfigContext';
import LayoutChild from "./layoutChild";
import { AudioPlayerProvider } from "./context/AudioPlayerContext";

export const metadata = {
  title: "Simple Voice Changer"
};

const RootLayout = ({
  children,
}: { children: React.ReactNode }) => {
  return (
    <AudioEditorProvider>
      <AudioPlayerProvider>
        <ApplicationConfigProvider>
          <LayoutChild>{children}</LayoutChild>
        </ApplicationConfigProvider>
      </AudioPlayerProvider>
    </AudioEditorProvider>
  )
};

export default RootLayout;