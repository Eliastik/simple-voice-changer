"use client";

import { useEffect } from "react";
import { Inter } from "next/font/google";
import Navbar from "./components/navbar/navbar";
import { useApplicationConfig } from "./context/ApplicationConfigContext";
import "./i18n";

const inter = Inter({ subsets: ['latin'] })

const LayoutChild = ({
    children,
}: { children: React.ReactNode }) => {
    const { currentTheme, setupLanguage, currentLanguageValue } = useApplicationConfig();

    useEffect(() => {
        setupLanguage();
    });
    
    return (
        <html data-theme={currentTheme ? currentTheme : "dark"} className="h-full" lang={currentLanguageValue}>
            <head>
                <link rel="manifest" href="/manifest.json" />
                <meta name="theme-color" content={currentTheme == "light" ? "#61A6FA" : "#3884FF"} />
            </head>
            <body className={`${inter.className} h-full flex flex-col overflow-x-hidden`}>
                <Navbar></Navbar>
                {children}
            </body>
        </html>
    )
};

export default LayoutChild;