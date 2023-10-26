import { Inter } from "next/font/google";
import Navbar from "./components/navbar/navbar";
import { useApplicationConfig } from "./context/ApplicationConfigContext";

const inter = Inter({ subsets: ['latin'] })

const LayoutChild = ({
    children,
}: { children: React.ReactNode }) => {
    const { currentTheme } = useApplicationConfig();
    
    return (
        <html data-theme={currentTheme ? currentTheme : "dark"} className="h-full">
            <body className={`${inter.className} h-full flex flex-col`}>
                <Navbar></Navbar>
                {children}
            </body>
        </html>
    )
};

export default LayoutChild;