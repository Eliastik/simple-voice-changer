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
        <LayoutChild>{children}</LayoutChild>
    );
};

export default RootLayout;
