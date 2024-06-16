import { test } from "@playwright/test";
import { disableInitialAudioRendering, enableCompatibilityMode, enableInitialAudioRendering, muteAudio, openAudioFile, openPageAndCloseWelcomeModal } from "./testsutils";

muteAudio();

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

    await page.waitForTimeout(2000);

    const playButton = page.locator("#playButton");

    await playButton.waitFor({ state: "visible", timeout: 500 });

    await playButton.click();

    const stopButton = page.locator("#stopPlayingButton");

    await stopButton.waitFor({ state: "visible", timeout: 10000 });
});
