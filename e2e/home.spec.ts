import { test, expect } from "@playwright/test";

test.describe("home", () => {
  test("hero heading and nav render", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toBeVisible();
    // Frames is an in-page anchor button (Lenis scroll); Contact routes as a link.
    await expect(page.getByRole("button", { name: "Frames" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Contact" })).toBeVisible();
  });

  test("no horizontal overflow", async ({ page }) => {
    await page.goto("/");
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    );
    expect(overflow).toBe(false);
  });
});
