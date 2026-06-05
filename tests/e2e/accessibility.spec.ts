import { expect, test } from "@playwright/test";

test("skip link moves focus to main content", async ({ page }) => {
  await page.goto("/fr");

  const skipLink = page.getByRole("link", {
    name: "Aller au contenu principal",
  });

  await page.keyboard.press("Tab");
  await expect(skipLink).toBeFocused();

  await page.keyboard.press("Enter");
  await expect(page.locator("#main-content")).toBeFocused();
});

test("tool changes move focus to the active tool heading", async ({ page }) => {
  await page.goto("/fr/app?tool=merge");

  await page.getByRole("button", { name: /^Modifier/ }).first().click();

  await expect(
    page.getByRole("heading", { name: "Ajouter un texte" }),
  ).toBeFocused();
});

test("tool navigation supports arrow keys", async ({ page }) => {
  await page.goto("/fr/app?tool=merge");

  const mergeButton = page.getByRole("button", { name: /^Fusionner/ }).first();
  await mergeButton.focus();
  await page.keyboard.press("ArrowDown");

  await expect(
    page.getByRole("heading", { name: "Gérer les pages PDF" }),
  ).toBeFocused();
});
