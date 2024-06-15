import { test, expect, Page } from "@playwright/test";
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

async function testDownloadAudio(page: Page, format: string, downloadTimeout: number) {
    const saveAudioButton = page.locator("#dropdownDownloadAudio");

    await saveAudioButton.waitFor({ state: "visible", timeout: 500 });

    await saveAudioButton.click();

    const saveToWavButton = page.locator("#dropdownDownloadAudio li", { hasText: format + " format" });

    await saveToWavButton.click();

    const notification = page.locator(".toast.toast-top > .alert");

    await notification.waitFor({ state: "visible", timeout: 500 });

    expect(notification).toBeVisible();

    const download = await page.waitForEvent("download", { timeout: downloadTimeout });

    await notification.waitFor({ state: "hidden", timeout: 500 });

    expect(notification).not.toBeVisible();

    expect(download.suggestedFilename()).toContain("." + format.toLowerCase());
}

test("saving audio as wav should work", async ({ page }) => {
    await testDownloadAudio(page, "WAV", 5000);
});


test("saving audio as mp3 should work", async ({ page }) => {
    await testDownloadAudio(page, "MP3", 30000);
});
