import { test, expect, Page } from "@playwright/test";
import path from "path";

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
    await page.goto("http://localhost:3000/");

    const closeWelcomeModal = page.locator("#modalFirstLaunch +div .modal-action button");

    await closeWelcomeModal.waitFor({ state: "visible", timeout: 2000 });

    if (await closeWelcomeModal.isVisible()) {
        await closeWelcomeModal.click();
    }

    const openFileButton = page.locator("body > div:not(.navbar) > button");
    const fileChooserPromise = page.waitForEvent("filechooser");

    openFileButton.click();

    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(path.join(__dirname, "files/audio.mp3"));

    const loadingBufferModal = page.locator("#loadingBufferModal +.modal");

    await loadingBufferModal.waitFor({ state: "hidden", timeout: 10000 });

    const validateButton = page.locator("div > button", { hasText: "Validate settings" });
    
    await validateButton.click();

    const loadingPopup = page.locator("#loadingAudioProcessing");

    await loadingPopup.waitFor({ state: "attached", timeout: 5000 });

    await loadingPopup.waitFor({ state: "detached", timeout: 5000 });
});

async function enableCompatibilityMode(page: Page) {
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

async function playingAudioTest(page: Page, isCompatibilityMode: boolean) {
    const playButton = page.locator("#playButton");

    await playButton.waitFor({ state: "visible", timeout: 500 });

    await playButton.click();

    await page.waitForTimeout(5500);

    if (!isCompatibilityMode) {
        const pauseButton = page.locator("#pauseButton");
    
        await pauseButton.click();

        await page.waitForTimeout(500);
    }

    const playerStatus = page.locator("#playerCurrentTime");

    expect(await playerStatus.innerText()).toBe("00:05");
}

test("playing audio should work", async ({ page }) => {
    await playingAudioTest(page, false);
});

test("playing audio should work - compatibility mode", async ({ page }) => {
    await enableCompatibilityMode(page);
    await playingAudioTest(page, true);
});

test("pausing and resuming audio should work", async ({ page }) => {
    const playButton = page.locator("#playButton");
    const pauseButton = page.locator("#pauseButton");

    await playButton.waitFor({ state: "visible", timeout: 500 });

    await playButton.click();
    
    await page.waitForTimeout(3000);

    await pauseButton.click();
    
    const playerStatus = page.locator("#playerCurrentTime");
    const timeAfterPause = await playerStatus.innerText();

    expect(timeAfterPause).toBe("00:03");

    await page.waitForTimeout(1000);

    await playButton.click();

    await page.waitForTimeout(2500);

    expect(await playerStatus.innerText()).toBe("00:05");
});

test("pausing and stopping audio should work - compatibility mode", async ({ page }) => {
    await enableCompatibilityMode(page);

    const playButton = page.locator("#playButton");
    const pauseButton = page.locator("#pauseButton");
    const stopButton = page.locator("#stopPlayingButton");

    await playButton.waitFor({ state: "visible", timeout: 500 });

    await playButton.click();
    
    await page.waitForTimeout(3000);

    expect(await pauseButton.count()).toBe(0);

    await stopButton.click();
    
    const playerStatus = page.locator("#playerCurrentTime");
    const timeAfterPause = await playerStatus.innerText();

    expect(timeAfterPause).toBe("00:00");

    await page.waitForTimeout(1000);

    await playButton.click();

    await page.waitForTimeout(3500);

    expect(await playerStatus.innerText()).toBe("00:03");
});

async function playingAudioToEnd(page: Page) {
    const playButton = page.locator("#playButton");

    await playButton.waitFor({ state: "visible", timeout: 500 });

    await playButton.click();
    
    await page.waitForTimeout(2000);
    
    await page.waitForFunction(
        selector => document.querySelector(selector)!.textContent === "00:00",
        "#playerCurrentTime",
        { timeout: 22000 }
    );
    
    await page.waitForTimeout(3000);

    const playerStatus = page.locator("#playerCurrentTime");

    expect(await playerStatus.innerText()).toBe("00:00");
}

test("playing audio to the end should work", async ({ page }) => {
    await playingAudioToEnd(page);
});

test("playing audio to the end should work - compatibility mode", async ({ page }) => {
    await enableCompatibilityMode(page);
    await playingAudioToEnd(page);
});

async function loopAudioTest(page: Page, isCompatibilityMode: boolean) {
    const loopButton = page.locator("#loopPlayingButton");

    await loopButton.waitFor({ state: "visible", timeout: 500 });

    await loopButton.click();

    const playButton = page.locator("#playButton");

    await playButton.click();
    
    await page.waitForTimeout(2500);

    const playerStatus = page.locator("#playerCurrentTime");

    expect(await playerStatus.innerText()).toBe("00:02");
    
    await page.waitForFunction(
        selector => document.querySelector(selector)!.textContent === "00:01",
        "#playerCurrentTime",
        { timeout: 20000 }
    );

    if (!isCompatibilityMode) {
        const pauseButton = page.locator("#pauseButton");
    
        await pauseButton.click();
    }

    expect(await playerStatus.innerText()).toBe("00:01");
}

test("looping play audio should work", async ({ page }) => {
    await loopAudioTest(page, false);
});

test("looping play audio should work - compatibility mode", async ({ page }) => {
    await enableCompatibilityMode(page);
    await loopAudioTest(page, true);
});

test("seeking within the audio should work", async ({ page }) => {
    const playButton = page.locator("#playButton");
    const pauseButton = page.locator("#pauseButton");
    const playerStatus = page.locator("#playerCurrentTime");

    await playButton.waitFor({ state: "visible", timeout: 500 });

    await playButton.click();
    
    await page.waitForTimeout(3500);

    expect(await playerStatus.innerText()).toBe("00:03");

    await pauseButton.click();

    const progressBar = page.locator("#audioPlayerProgress");

    await progressBar.click({ position: { x: 500, y: 10 } });

    expect(await playerStatus.innerText()).not.toBe("00:03");
});

async function validatingSettingsStopAudio(page: Page) {
    const playButton = page.locator("#playButton");
    const playerStatus = page.locator("#playerCurrentTime");

    await playButton.waitFor({ state: "visible", timeout: 500 });

    await playButton.click();
    
    await page.waitForTimeout(3500);

    expect(await playerStatus.innerText()).toBe("00:03");

    const validateButton = page.locator("div > button", { hasText: "Validate settings" });

    await validateButton.click();

    const loadingPopup = page.locator("#loadingAudioProcessing");

    await loadingPopup.waitFor({ state: "detached", timeout: 10000 });

    expect(await playerStatus.innerText()).toBe("00:00");
}

test("validating settings should stop audio playing and seek to start of audio", async ({ page }) => {
    await validatingSettingsStopAudio(page);
});

test("validating settings should stop audio playing and seek to start of audio - compatibility mode", async ({ page }) => {
    await enableCompatibilityMode(page);
    await validatingSettingsStopAudio(page);
});
