"use client"

import { useEffect } from "react";

export default function PWA() {
    let sw: ServiceWorkerContainer | undefined;

    if (typeof window !== "undefined") {
        sw = window?.navigator?.serviceWorker;
    }

    useEffect(() => {
        if (sw) {
            sw.register("/service-worker.js", { scope: "/" }).then((registration) => {
                console.log("Service Worker registration successful with scope: ", registration.scope);
            }).catch((err) => {
                console.log("Service Worker registration failed: ", err);
            });
        }
    }, [sw]);

    return (
        <></>
    )
};