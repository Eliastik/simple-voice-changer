import { test, expect } from "@playwright/test";
import path from "path";
import { openPageAndcloseWelcomeModal } from "./testsutils";

test.beforeEach(async ({ page }) => {
    await openPageAndcloseWelcomeModal(page);
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


test("returning to homepage should work", async ({ page }) => {
    const openFileButton = page.locator("body > div:not(.navbar) > button");
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

    expect(await openFileButton.isVisible());
});
