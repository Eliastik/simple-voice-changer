import { test, expect } from "@playwright/test";
import { openAudioFileAndProcess } from "./testsutils";

// Mute audio
test.use({
    launchOptions: {
        args: ["--mute-audio"]
    }
});

test.use({
    browserName: "firefox",
    launchOptions: {
        firefoxUserPrefs: {
            "media.volume_scale": "0.0"
        }
    }
});

test.beforeEach(async ({ page }) => {
    await openAudioFileAndProcess(page);
});
