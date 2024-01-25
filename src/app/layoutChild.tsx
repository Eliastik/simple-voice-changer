"use client";

import { useEffect } from "react";
import { Inter } from "next/font/google";
import Navbar from "./components/navbar/navbar";
import { useApplicationConfig } from "./context/ApplicationConfigContext";
// i18next imports (local and from the library)
import "./i18n";
import PWA from "./pwa";
import Constants from "./model/Constants";
import { AudioEditorProvider, AudioPlayerProvider } from "@eliastik/simple-sound-studio-components";

const inter = Inter({ subsets: ["latin"] });

const LayoutChild = ({
    children,
}: { children: React.ReactNode }) => {
    const { currentTheme, setupLanguage, currentLanguageValue } = useApplicationConfig();

    useEffect(() => {
        setupLanguage();
    });
    
    return (
        <AudioPlayerProvider>
            <AudioEditorProvider>
                <html data-theme={currentTheme ? currentTheme : Constants.THEMES.DARK} className="h-full" lang={currentLanguageValue}>
                    <head>
                        <link rel="manifest" href={Constants.SERVICE_WORKER_SCOPE + "/manifest.json"} />
                        <meta name="theme-color" content={currentTheme == Constants.THEMES.LIGHT ? "#61A6FA" : "#3884FF"} />
                    </head>
                    <body className={`${inter.className} h-full flex flex-col overflow-x-hidden`}>
                        <Navbar></Navbar>
                        {children}
                        <PWA></PWA>
                    </body>
                </html>
            </AudioEditorProvider>
        </AudioPlayerProvider>
    );
};

export default LayoutChild;
