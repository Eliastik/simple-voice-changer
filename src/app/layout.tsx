import "./globals.css";
import { AudioEditorProvider } from "./context/AudioEditorContext";
import { ApplicationConfigProvider } from './context/ApplicationConfigContext';
import LayoutChild from "./layoutChild";

export const metadata = {
  title: "Simple Voice Changer"
};

const RootLayout = ({
  children,
}: { children: React.ReactNode }) => {
  return (
    <AudioEditorProvider>
      <ApplicationConfigProvider>
        <LayoutChild>{children}</LayoutChild>
      </ApplicationConfigProvider>
    </AudioEditorProvider>
  )
};

export default RootLayout;