"use client";

import { useEffect } from "react";
import Constants from "./model/Constants";

export default function PWA() {
    let sw: ServiceWorkerContainer | undefined;

    if (typeof window !== "undefined") {
        sw = window?.navigator?.serviceWorker;
    }

    useEffect(() => {
        if (sw) {
            sw.register("service-worker.js", { scope: Constants.SERVICE_WORKER_SCOPE + "/" }).then((registration) => {
                console.log("Service Worker registration successful with scope: ", registration.scope);
            }).catch((err) => {
                console.log("Service Worker registration failed: ", err);
            });
        }
    }, [sw]);

    return (
        <></>
    );
};
