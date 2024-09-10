import { expect, test } from "@playwright/test";
import { disableInitialAudioRendering, enableCompatibilityMode, enableInitialAudioRendering, muteAudio, openAudioFile, openPageAndCloseWelcomeModal } from "./testsutils";

muteAudio();

test("enabling initial audio rendering should work", async ({ page }) => {
    await openPageAndCloseWelcomeModal(page);

    await enableInitialAudioRendering(page);
    
    await openAudioFile(page);

    const loadingPopup = page.locator("#loadingAudioProcessing");
    
    await loadingPopup.waitFor({ state: "attached", timeout: 5000 });
});

test("enabling initial audio rendering then cancelling initial rendering should display a notification", async ({ page }) => {
    await openPageAndCloseWelcomeModal(page);

    await enableInitialAudioRendering(page);
    
    await openAudioFile(page);

    const cancelButton = page.locator("#loadingAudioProcessing + div button", { hasText: "Cancel" });

    await cancelButton.waitFor({ state: "visible", timeout: 10000 });

    await cancelButton.click({ force: true });

    const loadingPopup = page.locator("#loadingAudioProcessing");
    
    await loadingPopup.waitFor({ state: "detached", timeout: 10000 });

    const notification = page.locator(".toast.toast-top > .alert.alert-info");

    await expect.poll(async () => await notification.count() == 1, {
        timeout: 5000,
        message: "Initial rendering cancelled notification was not visible which is not expected"
    }).toBe(true);
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
