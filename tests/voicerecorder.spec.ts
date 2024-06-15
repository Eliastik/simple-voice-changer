import { expect, test } from "@playwright/test";
import { openPageAndCloseWelcomeModal, openVoiceRecorder } from "./testsutils";

test.use({
    launchOptions: {
        args: [
            "--use-fake-ui-for-media-stream",
            "--use-fake-device-for-media-stream",
            "--use-file-for-fake-audio-capture=path/to/your/audio.wav"
        ]
    },
    browserName: "chromium",
});

test.beforeEach(async ({ page }) => {
    await openPageAndCloseWelcomeModal(page);
});

test("opening voice recorder should work", async ({ page }) => {
    await openVoiceRecorder(page);

    const recordButton = page.locator("#recordAudio");
    
    await page.waitForTimeout(2000);

    expect(recordButton).toBeVisible();
});
