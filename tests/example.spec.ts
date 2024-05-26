import { test, expect } from "@playwright/test";
 
test("should display title", async ({ page }) => {
    await page.goto("http://localhost:3000/");
    await expect(page.locator(".navbar .btn:first-child div:first-child")).toContainText("Simple Voice Changer");
});
