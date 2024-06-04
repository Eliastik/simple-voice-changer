import { test, expect } from "@playwright/test";
import path from "path";

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
});
 
test("enabling filter should work", async ({ page }) => {
    const filter = page.locator("button", { hasText: "Bass booster" });

    await filter.waitFor({ state: "visible", timeout: 3000 });

    await filter.click();

    expect(filter).toHaveClass(/(.*)(btn-secondary)(.*)/, { timeout: 500 });
});
 
test("disabling filter should work", async ({ page }) => {
    const filter = page.locator("button", { hasText: "Limiter" });

    await filter.waitFor({ state: "visible", timeout: 3000 });

    await filter.click();

    expect(filter).not.toHaveClass(/(.*)(btn-secondary)(.*)/, { timeout: 500 });
});