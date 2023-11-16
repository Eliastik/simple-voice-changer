"use client";

import { useEffect } from "react";
import { Inter } from "next/font/google";
import Navbar from "./components/navbar/navbar";
import { useApplicationConfig } from "./context/ApplicationConfigContext";
import "./i18n";
import PWA from "./pwa";
import Constants from "./model/Constants";

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
                <link rel="manifest" href={Constants.serviceWorkerScope + "manifest.json"} />
                <meta name="theme-color" content={currentTheme == "light" ? "#61A6FA" : "#3884FF"} />
            </head>
            <body className={`${inter.className} h-full flex flex-col overflow-x-hidden`}>
                <Navbar></Navbar>
                {children}
                <PWA></PWA>
            </body>
        </html>
    )
};

export default LayoutChild;