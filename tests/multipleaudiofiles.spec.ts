import { test, expect } from "@playwright/test";
import { muteAudio, openMultipleAudioFile, openPageAndCloseWelcomeModal } from "./testsutils";

muteAudio();

test.beforeEach(async ({ page }) => {
    await openPageAndCloseWelcomeModal(page);
    await openMultipleAudioFile(page);
});

test("opening multiple audio files should display specific buttons", async ({ page }) => {
    const previousMediaButton = page.locator("#previousMediaButton");
    const playlistButton = page.locator("#playlistButton");
    const nextMediaButton = page.locator("#nextMediaButton");

    await expect(previousMediaButton).toBeVisible();
    await expect(playlistButton).toBeVisible();
    await expect(nextMediaButton).toBeVisible();
});

test("playlist should display the 3 files", async ({ page }) => {
    const playlistButton = page.locator("#playlistButton");

    await playlistButton.click({ timeout: 5000 });

    const modalAudioFileList = page.locator("#modalAudioFileList");

    await expect(modalAudioFileList).toBeVisible();

    const buttons = modalAudioFileList.locator(".join button");

    const allButtons = await buttons.all();

    for (let i = 0; i < allButtons.length; i++) {
        if (i == 0) {
            expect(await allButtons[i].innerText()).toBe("audio.mp3");
        } else {
            expect(await allButtons[i].innerText()).toBe(`audio_${i + 1}.mp3`);
        }
    }
});

test("switching to next audio should work", async ({ page }) => {
    const nextMediaButton = page.locator("#nextMediaButton");

    await nextMediaButton.click({ timeout: 5000 });

    const playlistButton = page.locator("#playlistButton");

    await playlistButton.click({ timeout: 5000 });

    const modalAudioFileList = page.locator("#modalAudioFileList");

    const buttons = modalAudioFileList.locator(".join button");
    const allButtons = await buttons.all();

    const firstAudioButton = allButtons[0];
    const secondAudioButton = allButtons[1];

    await expect(firstAudioButton).not.toHaveClass(/btn-primary/);
    await expect(secondAudioButton).toHaveClass(/btn-primary/);
});

test("switching to previous audio should work", async ({ page }) => {
    const nextMediaButton = page.locator("#nextMediaButton");

    await nextMediaButton.click({ timeout: 5000 });

    const previousMediaButton = page.locator("#previousMediaButton");

    await previousMediaButton.click({ timeout: 15000 });

    const playlistButton = page.locator("#playlistButton");

    await playlistButton.click({ timeout: 5000 });

    const modalAudioFileList = page.locator("#modalAudioFileList");

    const buttons = modalAudioFileList.locator(".join button");
    const allButtons = await buttons.all();

    const firstAudioButton = allButtons[0];
    const secondAudioButton = allButtons[1];

    await expect(firstAudioButton).toHaveClass(/btn-primary/);
    await expect(secondAudioButton).not.toHaveClass(/btn-primary/);
});

test("switching to previous audio when current audio is the first of the list, should switch to the last audio of the list", async ({ page }) => {
    const previousMediaButton = page.locator("#previousMediaButton");

    await previousMediaButton.click({ timeout: 15000 });

    const playlistButton = page.locator("#playlistButton");

    await playlistButton.click({ timeout: 5000 });

    const modalAudioFileList = page.locator("#modalAudioFileList");

    const buttons = modalAudioFileList.locator(".join button");
    const allButtons = await buttons.all();

    const firstAudioButton = allButtons[0];
    const secondAudioButton = allButtons[1];
    const lastAudioButton = allButtons[allButtons.length - 1];

    await expect(firstAudioButton).not.toHaveClass(/btn-primary/);
    await expect(secondAudioButton).not.toHaveClass(/btn-primary/);
    await expect(lastAudioButton).toHaveClass(/btn-primary/);
});

test("switching to next audio when current audio is the last of the list, should switch to the first audio of the list", async ({ page }) => {
    const nextMediaButton = page.locator("#nextMediaButton");

    await nextMediaButton.click({ timeout: 5000 });
    await nextMediaButton.click({ timeout: 15000 });
    await nextMediaButton.click({ timeout: 15000 });

    const playlistButton = page.locator("#playlistButton");

    await playlistButton.click({ timeout: 5000 });

    const modalAudioFileList = page.locator("#modalAudioFileList");

    const buttons = modalAudioFileList.locator(".join button");
    const allButtons = await buttons.all();

    const firstAudioButton = allButtons[0];
    const secondAudioButton = allButtons[1];
    const lastAudioButton = allButtons[allButtons.length - 1];

    await expect(firstAudioButton).toHaveClass(/btn-primary/);
    await expect(secondAudioButton).not.toHaveClass(/btn-primary/);
    await expect(lastAudioButton).not.toHaveClass(/btn-primary/);
});

test("selecting audio in playlist should work", async ({ page }) => {
    const playlistButton = page.locator("#playlistButton");

    await playlistButton.click({ timeout: 5000 });

    const modalAudioFileList = page.locator("#modalAudioFileList");

    const buttons = modalAudioFileList.locator(".join button");
    const allButtons = await buttons.all();

    const firstAudioButton = allButtons[0];
    const secondAudioButton = allButtons[1];

    await secondAudioButton.click({ timeout: 5000 });

    await expect(firstAudioButton).not.toHaveClass(/btn-primary/);
    await expect(secondAudioButton).toHaveClass(/btn-primary/);
});

test("loop audio should go to next audio when current audio have finished playing", async ({ page }) => {
    const loopPlayingButton = page.locator("#loopPlayingButton");

    await loopPlayingButton.click({ timeout: 5000 });

    const playButton = page.locator("#playButton");

    await playButton.click({ timeout: 5000 });
    
    await page.waitForTimeout(2500);

    const playerStatus = page.locator("#playerCurrentTime");

    expect(await playerStatus.innerText()).toBe("00:02");
    
    await page.waitForFunction(
        selector => document.querySelector(selector)!.textContent === "00:01",
        "#playerCurrentTime",
        { timeout: 20000 }
    );
    
    const modalAudioFileList = page.locator("#modalAudioFileList");

    const buttons = modalAudioFileList.locator(".join button");
    const allButtons = await buttons.all();

    const firstAudioButton = allButtons[0];
    const secondAudioButton = allButtons[1];

    await expect(firstAudioButton).not.toHaveClass(/btn-primary/);
    await expect(secondAudioButton).toHaveClass(/btn-primary/);
});

test("loop current audio should not go to next audio when current audio have finished playing", async ({ page }) => {
    const loopPlayingButton = page.locator("#loopPlayingButton");

    // Double clic: loop current audio only
    await loopPlayingButton.click({ timeout: 5000 });
    await loopPlayingButton.click({ timeout: 5000 });

    const playButton = page.locator("#playButton");

    await playButton.click({ timeout: 5000 });
    
    await page.waitForTimeout(2500);

    const playerStatus = page.locator("#playerCurrentTime");

    expect(await playerStatus.innerText()).toBe("00:02");
    
    await page.waitForFunction(
        selector => document.querySelector(selector)!.textContent === "00:01",
        "#playerCurrentTime",
        { timeout: 20000 }
    );
    
    const modalAudioFileList = page.locator("#modalAudioFileList");

    const buttons = modalAudioFileList.locator(".join button");
    const allButtons = await buttons.all();

    const firstAudioButton = allButtons[0];
    const secondAudioButton = allButtons[1];

    await expect(firstAudioButton).toHaveClass(/btn-primary/);
    await expect(secondAudioButton).not.toHaveClass(/btn-primary/);
});
