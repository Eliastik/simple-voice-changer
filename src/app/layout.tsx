import { ApplicationConfigProvider } from "./context/ApplicationConfigContext";
import { AudioRecorderProvider } from "./context/AudioRecorderContext";
import LayoutChild from "./layoutChild";
import Constants from "./model/Constants";
import "./globals.css";

export const metadata = {
    title: Constants.APP_NAME
};

const RootLayout = ({
    children,
}: { children: React.ReactNode }) => {
    return (
        <AudioRecorderProvider>
            <ApplicationConfigProvider>
                <LayoutChild>{children}</LayoutChild>
            </ApplicationConfigProvider>
        </AudioRecorderProvider>
    );
};

export default RootLayout;
