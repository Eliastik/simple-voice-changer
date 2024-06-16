import { test, expect, Page } from "@playwright/test";
import { enableCompatibilityMode, loopAudioPlayer, muteAudio, openAudioFileAndProcess, stopAudioPlaying, validateSettings } from "./testsutils";

muteAudio();

test.beforeEach(async ({ page }) => {
    await openAudioFileAndProcess(page);
});

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

    await playButton.waitFor({ state: "visible", timeout: 500 });

    await playButton.click();
    
    await page.waitForTimeout(3000);

    await expect(pauseButton).toHaveCount(0);

    await stopAudioPlaying(page);
    
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
    await loopAudioPlayer(page);

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

async function validatingSettingsStopAudio(page: Page, compatibilityMode: boolean) {
    const playButton = page.locator("#playButton");
    const playerStatus = page.locator("#playerCurrentTime");

    await playButton.waitFor({ state: "visible", timeout: 500 });

    await playButton.click();
    
    await page.waitForTimeout(3500);

    expect(await playerStatus.innerText()).toBe("00:03");

    await validateSettings(page, compatibilityMode);

    const loadingPopup = page.locator("#loadingAudioProcessing");

    await loadingPopup.waitFor({ state: "detached", timeout: 10000 });

    expect(await playerStatus.innerText()).toBe("00:00");
}

test("validating settings should stop audio playing and seek to start of audio", async ({ page }) => {
    await validatingSettingsStopAudio(page, false);
});

test("validating settings should stop audio playing and seek to start of audio - compatibility mode", async ({ page }) => {
    await enableCompatibilityMode(page);
    await validatingSettingsStopAudio(page, true);
});
