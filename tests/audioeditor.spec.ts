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

    await filter.waitFor({ state: "visible", timeout: 10000 });

    await filter.click();

    const classList = await filter.evaluate(button => button.className);

    expect(classList).toContain("btn-secondary");
});
 
test("disabling filter should work", async ({ page }) => {
    const filter = page.locator("button", { hasText: "Limiter" });

    await filter.waitFor({ state: "visible", timeout: 10000 });

    await filter.click();

    const classList = await filter.evaluate(button => button.className);

    expect(classList).not.toContain("btn-secondary");
});

test("resetting filters should work", async ({ page }) => {
    const filter = page.locator("button", { hasText: "Bass booster" });
    const resetButton = page.locator("div > button.btn-error", { hasText: "Reset" });

    await filter.waitFor({ state: "visible", timeout: 10000 });

    await filter.click();
    await resetButton.click();

    const classList = await filter.evaluate(button => button.className);

    expect(classList).not.toContain("btn-secondary");
});

test("changing settings of filter should work", async ({ page }) => {
    const filter = page.locator("div.join", { hasText: "Bass booster" });

    await filter.waitFor({ state: "visible", timeout: 10000 });

    const filterSettings = filter.locator(".flex.join > button:first-child");

    await filterSettings.click();

    const modalSettings = page.locator("#modalSettings_bassboost");

    expect(modalSettings).toHaveAttribute("open", { timeout: 10000 });

    await page.locator("#bassboost_frequencyBooster").fill("25");

    const validateButton = modalSettings.locator("button", { hasText: "Validate" });

    await validateButton.click();

    await page.waitForTimeout(5000);

    const isOpen = await modalSettings.evaluate(modal => window.getComputedStyle(modal).opacity != "0");

    expect(isOpen).toBe(false);
});

test("resetting settings of filter should work", async ({ page }) => {
    const filter = page.locator("div.join", { hasText: "Bass booster" });

    await filter.waitFor({ state: "visible", timeout: 3000 });

    const filterSettings = filter.locator(".flex.join > button:first-child");

    await filterSettings.click();

    const modalSettings = page.locator("#modalSettings_bassboost");

    await modalSettings.waitFor({ state: "visible", timeout: 3000 });

    const input = page.locator("#bassboost_frequencyBooster");

    await input.fill("25");

    const resetButton = modalSettings.locator("button", { hasText: "Reset" });

    await resetButton.click();

    expect(input.inputValue).not.toBe("25");
});
