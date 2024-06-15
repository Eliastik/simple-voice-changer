import { test, expect, Page } from "@playwright/test";
import { enableCompatibilityMode, loopAudioPlayer, muteAudio, openAudioFileAndProcess, saveAudio, stopAudioPlaying, validateSettings } from "./testsutils";

muteAudio();

test.beforeEach(async ({ page }) => {
    await openAudioFileAndProcess(page);
});

async function testNotificationOpened(page: Page) {
    const notification = page.locator(".toast.toast-top > .alert.alert-info");

    await expect.poll(async () => await notification.count() == 1, {
        timeout: 5000,
        message: "Audio download notification was not visible which is not expected"
    }).toBe(true);
}

async function testNotificationClosed(page: Page) {
    const notification = page.locator(".toast.toast-top > .alert.alert-info");

    await expect.poll(async () => await notification.count() == 0, {
        timeout: 5000,
        message: "Audio download notification was visible which is not expected"
    }).toBe(true);
}

async function testDownloadAudio(page: Page, format: string, downloadTimeout: number) {
    await saveAudio(page, format);

    await testNotificationOpened(page);

    const download = await page.waitForEvent("download", { timeout: downloadTimeout });

    await testNotificationClosed(page);

    expect(download.suggestedFilename()).toContain("." + format.toLowerCase());
}

test("saving audio as wav should work", async ({ page }) => {
    await testDownloadAudio(page, "WAV", 5000);
});


test("saving audio as mp3 should work", async ({ page }) => {
    await testDownloadAudio(page, "MP3", 15000);
});


test("saving audio as wav should work - compatibility mode", async ({ page }) => {
    await enableCompatibilityMode(page);
    await testDownloadAudio(page, "WAV", 20000);
});


test("saving audio as mp3 should work - compatibility mode", async ({ page }) => {
    await enableCompatibilityMode(page);
    await testDownloadAudio(page, "MP3", 30000);
});

test("saving audio and looping audio player should work - compatibility mode", async ({ page }) => {
    await enableCompatibilityMode(page);

    await loopAudioPlayer(page);

    await testDownloadAudio(page, "WAV", 35000);

    const playerStatus = page.locator("#playerCurrentTime");

    await page.waitForFunction(
        selector => document.querySelector(selector)!.textContent === "00:01",
        "#playerCurrentTime",
        { timeout: 20000 }
    );

    expect(await playerStatus.innerText()).toBe("00:01");
});

async function expectNoDownload(page: Page) {
    let downloadEventFired = false;

    page.on("download", () => {
        downloadEventFired = true;
    });

    await page.waitForTimeout(5000);

    expect(downloadEventFired).toBe(false);
}

test("saving audio and stopping audio player should stop recording - compatibility mode", async ({ page }) => {
    await enableCompatibilityMode(page);

    await saveAudio(page, "WAV");
    
    await testNotificationOpened(page);
    
    await stopAudioPlaying(page);
   
    await testNotificationClosed(page);

    await expectNoDownload(page);
});

test("saving audio and validating settings should stop recording - compatibility mode", async ({ page }) => {
    await enableCompatibilityMode(page);

    await saveAudio(page, "MP3");
    
    await testNotificationOpened(page);
    
    await validateSettings(page, true);
    
    await testNotificationClosed(page);
    
    await expectNoDownload(page);
});
