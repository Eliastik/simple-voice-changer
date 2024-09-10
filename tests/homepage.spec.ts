import { test, expect } from "@playwright/test";
import path from "path";
import { openPageAndCloseWelcomeModal } from "./testsutils";

test.beforeEach(async ({ page }) => {
    await openPageAndCloseWelcomeModal(page);
});
 
test("should display title", async ({ page }) => {
    await expect(page.locator(".navbar .btn:first-child div:first-child")).toContainText("Simple Voice Changer");
});

test("opening wrong file should display error", async ({ page }) => {
    const openFileButton = page.locator("body > div:not(.navbar) button", { hasText: "Select one or more audio files" });
    const fileChooserPromise = page.waitForEvent("filechooser");

    openFileButton.click();

    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(path.join(__dirname, "files/document.pdf"));

    const modalErrorLoadingDialog = page.locator("#errorLoadingAudioDialog +.modal");

    await modalErrorLoadingDialog.waitFor({ state: "attached", timeout: 5000 });

    await expect(modalErrorLoadingDialog).toHaveCount(1);
});

test("opening audio file should not display error", async ({ page }) => {
    const openFileButton = page.locator("body > div:not(.navbar) button", { hasText: "Select one or more audio files" });
    const fileChooserPromise = page.waitForEvent("filechooser");

    openFileButton.click();

    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(path.join(__dirname, "files/audio.mp3"));

    const modalErrorLoadingDialog = page.locator("#errorLoadingAudioDialog +.modal");

    await modalErrorLoadingDialog.waitFor({ state: "detached", timeout: 5000 });

    await expect(modalErrorLoadingDialog).toHaveCount(0);
});

test("returning to homepage should work", async ({ page }) => {
    const openFileButton = page.locator("body > div:not(.navbar) button", { hasText: "Select one or more audio files" });
    const fileChooserPromise = page.waitForEvent("filechooser");

    openFileButton.click();

    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(path.join(__dirname, "files/audio.mp3"));

    const homepageButton = page.locator(".navbar > .btn.btn-ghost:nth-child(1)");

    await homepageButton.waitFor({ state: "visible", timeout: 5000 });

    expect(!(await openFileButton.isVisible()));

    await homepageButton.click();

    const modalGoToHome = page.locator("#modalGoToHome");
    
    await modalGoToHome.waitFor({ state: "attached", timeout: 5000 });

    const returnToHomeModalButton = page.locator("#modalGoToHome .btn", { hasText: "OK" });

    await returnToHomeModalButton.waitFor({ state: "visible", timeout: 500 });

    await returnToHomeModalButton.click();

    await expect(openFileButton).toBeVisible();
});
