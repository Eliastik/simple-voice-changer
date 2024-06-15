import { expect, test } from "@playwright/test";
import { disableInitialAudioRendering, enableCompatibilityMode, enableInitialAudioRendering, openAudioFile, openPageAndCloseWelcomeModal } from "./testsutils";

test("enabling initial audio rendering should work", async ({ page }) => {
    await openPageAndCloseWelcomeModal(page);

    await enableInitialAudioRendering(page);
    
    await openAudioFile(page);

    const loadingPopup = page.locator("#loadingAudioProcessing");
    
    await loadingPopup.waitFor({ state: "attached", timeout: 5000 });
});

test("disabling initial audio rendering and enabling compatibility mode should work - audio player", async ({ page }) => {
    await openPageAndCloseWelcomeModal(page);

    await enableCompatibilityMode(page);

    await disableInitialAudioRendering(page);
    
    await openAudioFile(page);

    const playButton = page.locator("#playButton");

    await playButton.waitFor({ state: "visible", timeout: 500 });

    await playButton.click();

    const stopButton = page.locator("#stopPlayingButton");

    await expect.poll(() => stopButton.isVisible(), {
        timeout: 2000,
        message: "Stop button was not visible as expected"
    }).toBe(true);
});
