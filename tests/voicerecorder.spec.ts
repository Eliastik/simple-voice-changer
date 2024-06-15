import { Page, expect, test } from "@playwright/test";
import { openPageAndCloseWelcomeModal, openVoiceRecorder } from "./testsutils";

let page: Page;

test.use({
    launchOptions: {
        args: [
            "--use-fake-ui-for-media-stream",
            "--use-fake-device-for-media-stream"
        ]
    },
    browserName: "chromium",
});

test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();

    const context = await browser.newContext();
    await context.grantPermissions(["microphone"]);

    await openPageAndCloseWelcomeModal(page);

    context.clearPermissions();
});

test.afterAll(async ({ browser }) => {
    await browser.newContext();
});

test("opening voice recorder should work", async () => {
    await openVoiceRecorder(page);

    const recordButton = page.locator("#recordAudio");

    await recordButton.waitFor({ state: "visible", timeout: 5000 });

    expect(recordButton).toBeVisible();
});

test("stop button should be disabled when no audio has been recorded", async () => {
    await openVoiceRecorder(page);

    const recordButton = page.locator("#recordAudio");

    await recordButton.waitFor({ state: "visible", timeout: 5000 });

    expect(recordButton).toBeVisible();

    const stopButton = page.locator("#stopRecordAudio");

    await stopButton.waitFor({ state: "visible", timeout: 500 });

    expect(stopButton).toBeDisabled();
});

test("recording then pausing should work", async () => {
    await openVoiceRecorder(page);

    const recordButton = page.locator("#recordAudio");

    const recordingTime = page.locator("#audioRecorderTime");

    await recordButton.waitFor({ state: "visible", timeout: 5000 });

    expect(recordButton).toBeVisible();

    expect(await recordingTime.innerText()).toBe("00:00");

    await recordButton.click();

    await page.waitForTimeout(5500);

    const pauseRecord = page.locator("#pauseRecordAudio");

    await pauseRecord.waitFor({ state: "visible", timeout: 500 });

    expect(await recordingTime.innerText()).toBe("00:05");
});

test("recording then stopping should open audio editor", async () => {
    await openVoiceRecorder(page);

    const recordButton = page.locator("#recordAudio");

    await recordButton.waitFor({ state: "visible", timeout: 5000 });

    expect(recordButton).toBeVisible();

    await recordButton.click();

    await page.waitForTimeout(3000);

    const stopButton = page.locator("#stopRecordAudio");

    await stopButton.waitFor({ state: "visible", timeout: 500 });

    expect(stopButton).not.toBeDisabled();

    await stopButton.click();
    
    const validateButton = page.locator("div > button", { hasText: "Validate settings" });

    await expect.poll(async () => await validateButton.isVisible(), {
        timeout: 5000,
        message: "Audio editor wasn't opened which is not expected"
    }).toBe(true);
});
