import { test, expect } from "@playwright/test";
import path from "path";

test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000/");

    const closeWelcomeModal = page.locator("#modalFirstLaunch +div .modal-action button");

    await closeWelcomeModal.waitFor({ state: "visible", timeout: 2000 });

    if (await closeWelcomeModal.isVisible()) {
        await closeWelcomeModal.click();
    }
});
 
test("should display title", async ({ page }) => {
    await expect(page.locator(".navbar .btn:first-child div:first-child")).toContainText("Simple Voice Changer");
});

test("opening wrong file should display error", async ({ page }) => {
    const openFileButton = page.locator("body > div:not(.navbar) > button");
    const fileChooserPromise = page.waitForEvent("filechooser");

    openFileButton.click();

    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(path.join(__dirname, "files/document.pdf"));

    const modalErrorLoadingDialog = page.locator("#errorLoadingAudioDialog +.modal");

    expect(await modalErrorLoadingDialog.isVisible());
});

test("opening audio file should not display error", async ({ page }) => {
    const openFileButton = page.locator("body > div:not(.navbar) > button");
    const fileChooserPromise = page.waitForEvent("filechooser");

    openFileButton.click();

    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(path.join(__dirname, "files/audio.mp3"));

    const modalErrorLoadingDialog = page.locator("#errorLoadingAudioDialog +.modal");

    expect(!(await modalErrorLoadingDialog.isVisible()));
});
