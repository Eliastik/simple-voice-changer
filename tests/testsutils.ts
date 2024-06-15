import { Page } from "@playwright/test";
import path from "path";

export async function openPageAndcloseWelcomeModal(page: Page) {
    await page.goto("http://localhost:3000/");

    const closeWelcomeModal = page.locator("#modalFirstLaunch +div .modal-action button");

    await closeWelcomeModal.waitFor({ state: "visible", timeout: 2000 });

    if (await closeWelcomeModal.isVisible()) {
        await closeWelcomeModal.click();
    }
}

export async function openAudioFile(page: Page) {
    const openFileButton = page.locator("body > div:not(.navbar) > button");
    const fileChooserPromise = page.waitForEvent("filechooser");

    openFileButton.click();

    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(path.join(__dirname, "files/audio.mp3"));

    const loadingBufferModal = page.locator("#loadingBufferModal +.modal");

    await loadingBufferModal.waitFor({ state: "hidden", timeout: 10000 });
}

export async function processAudio(page: Page) {
    const validateButton = page.locator("div > button", { hasText: "Validate settings" });
    
    await validateButton.click();

    const loadingPopup = page.locator("#loadingAudioProcessing");

    await loadingPopup.waitFor({ state: "attached", timeout: 5000 });

    await loadingPopup.waitFor({ state: "detached", timeout: 5000 });
}

export async function openAudioFileAndProcess(page: Page) {
    await openPageAndcloseWelcomeModal(page);
    await openAudioFile(page);
    await processAudio(page);
}

export async function enableCompatibilityMode(page: Page) {
    const settingsButton = page.locator("#appSettingsButton");
    
    await settingsButton.waitFor({ state: "visible", timeout: 500 });

    await settingsButton.click();

    const settingsDialog = page.locator("#modalSettings");
    
    await settingsDialog.waitFor({ state: "attached", timeout: 5000 });

    const compatibilityModeCheckbox = page.locator("#compatibilityMode");
    
    await compatibilityModeCheckbox.waitFor({ state: "visible", timeout: 500 });

    await compatibilityModeCheckbox.check();

    const closeButton = settingsDialog.locator("button", { hasText: "Close" });

    await closeButton.click();

    await page.waitForTimeout(2000);

    const validateButton = page.locator("div > button", { hasText: "Validate settings" });

    await validateButton.click();

    const loadingPopup = page.locator("#loadingAudioProcessing");

    await loadingPopup.waitFor({ state: "detached", timeout: 10000 });
}
