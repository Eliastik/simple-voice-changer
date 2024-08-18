import test, { Page } from "@playwright/test";
import path from "path";

export async function openPageAndCloseWelcomeModal(page: Page) {
    await page.goto("http://localhost:3000/");

    const closeWelcomeModal = page.locator("#modalFirstLaunch +div .modal-action button");

    await closeWelcomeModal.waitFor({ state: "visible", timeout: 2000 });

    if (await closeWelcomeModal.isVisible()) {
        await closeWelcomeModal.click();
    }
}

export async function openAudioFile(page: Page) {
    const openFileButton = page.locator("body > div:not(.navbar) button", { hasText: "Select one or more audio files" });
    const fileChooserPromise = page.waitForEvent("filechooser");

    openFileButton.click();

    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(path.join(__dirname, "files/audio.mp3"));

    const loadingBufferModal = page.locator("#loadingBufferModal +.modal");

    await loadingBufferModal.waitFor({ state: "hidden", timeout: 10000 });
}

export async function openMultipleAudioFile(page: Page) {
    const openFileButton = page.locator("body > div:not(.navbar) button", { hasText: "Select one or more audio files" });
    const fileChooserPromise = page.waitForEvent("filechooser");

    openFileButton.click();

    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles([path.join(__dirname, "files/audio.mp3"), path.join(__dirname, "files/audio_2.mp3"), path.join(__dirname, "files/audio_3.mp3")]);

    const loadingBufferModal = page.locator("#loadingBufferModal +.modal");

    await loadingBufferModal.waitFor({ state: "hidden", timeout: 10000 });
}

export async function openVoiceRecorder(page: Page) {
    const openAudioRecording = page.locator("body > div:not(.navbar) button", { hasText: "Record with the microphone" });

    openAudioRecording.click();

    const loadingBufferModal = page.locator("#audioRecorderAuthorizationDialog +.modal");

    await loadingBufferModal.waitFor({ state: "hidden", timeout: 10000 });
}

export async function validateSettings(page: Page, compatibilityMode: boolean) {
    const validateButton = page.locator("div > button", { hasText: "Validate settings" });
    
    if (await validateButton.isVisible()) {
        await validateButton.click();
    
        if (!compatibilityMode) {
            const loadingPopup = page.locator("#loadingAudioProcessing");
    
            await loadingPopup.waitFor({ state: "attached", timeout: 5000 });
        }
    }
}

export async function processAudio(page: Page) {
    await validateSettings(page, false);

    const loadingPopup = page.locator("#loadingAudioProcessing");

    await loadingPopup.waitFor({ state: "detached", timeout: 5000 });
}

export async function openAudioFileAndProcess(page: Page) {
    await openPageAndCloseWelcomeModal(page);
    await openAudioFile(page);
    await processAudio(page);
}

export async function openSettingsDialog(page: Page) {
    const settingsButton = page.locator("#appSettingsButton");

    await settingsButton.waitFor({ state: "visible", timeout: 500 });

    await settingsButton.click();

    const settingsDialog = page.locator("#modalSettings");

    await settingsDialog.waitFor({ state: "attached", timeout: 5000 });
}

export async function closeSettingsDialog(page: Page) {
    const settingsDialog = page.locator("#modalSettings");

    const closeButton = settingsDialog.locator("button", { hasText: "Close" });

    await closeButton.click();
}

export async function enableCompatibilityMode(page: Page) {
    await openSettingsDialog(page);

    const compatibilityModeCheckbox = page.locator("#compatibilityMode");
    
    await compatibilityModeCheckbox.waitFor({ state: "visible", timeout: 500 });

    await compatibilityModeCheckbox.check();
    
    await closeSettingsDialog(page);

    await validateSettings(page, true);
}

export async function enableInitialAudioRendering(page: Page) {
    await openSettingsDialog(page);

    const enableInitialRenderingCheckbox = page.locator("#enableInitialRendering");
    
    await enableInitialRenderingCheckbox.waitFor({ state: "visible", timeout: 500 });

    await enableInitialRenderingCheckbox.check();
    
    await closeSettingsDialog(page);

    await validateSettings(page, false);
}

export async function disableInitialAudioRendering(page: Page) {
    await openSettingsDialog(page);

    const enableInitialRenderingCheckbox = page.locator("#enableInitialRendering");
    
    await enableInitialRenderingCheckbox.waitFor({ state: "visible", timeout: 500 });

    await enableInitialRenderingCheckbox.uncheck();
    
    await closeSettingsDialog(page);

    await validateSettings(page, false);
}

export async function saveAudio(page: Page, format: string) {
    const saveAudioButton = page.locator("#dropdownDownloadAudio");

    await saveAudioButton.waitFor({ state: "visible", timeout: 500 });

    await saveAudioButton.click();

    const saveToFormatAudioButton = page.locator("#dropdownDownloadAudio li", { hasText: format + " format" });

    await saveToFormatAudioButton.click();
}

export async function loopAudioPlayer(page: Page) {
    const loopButton = page.locator("#loopPlayingButton");

    await loopButton.waitFor({ state: "visible", timeout: 500 });

    await loopButton.click();
}

export async function stopAudioPlaying(page: Page) {
    const stopButton = page.locator("#stopPlayingButton");

    await stopButton.waitFor({ state: "visible", timeout: 2000 });

    await stopButton.click();
}

export function muteAudio() {
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
}
