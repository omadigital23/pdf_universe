import { expect, test } from "@playwright/test";

const toolCases = [
  { tool: "merge", heading: "Assembler plusieurs PDF" },
  { tool: "organize", heading: "Gérer les pages PDF" },
  { tool: "images-to-pdf", heading: "JPG ou PNG vers document" },
  { tool: "pdf-to-images", heading: "Exporter toutes les pages" },
  { tool: "sign", heading: "Signature visuelle" },
  { tool: "edit", heading: "Ajouter un texte" },
] as const;

test("landing page is localized and links to the studio", async ({ page }) => {
  await page.goto("/fr");

  await expect(page.getByRole("heading", { name: "Vos PDF, sous contrôle." })).toBeVisible();
  await expect(page.getByRole("link", { name: "Essayer gratuitement" })).toHaveAttribute(
    "href",
    "/fr/app",
  );
  await expect(page.getByRole("link", { name: "EN", exact: true })).toHaveAttribute(
    "href",
    "/en",
  );
});

for (const { tool, heading } of toolCases) {
  test(`${tool} renders from query state`, async ({ page }) => {
    await page.goto(`/fr/app?tool=${tool}`);

    await expect(page.getByRole("heading", { name: heading })).toBeVisible();
    await expect
      .poll(() =>
        page.evaluate(
          () =>
            document.documentElement.scrollWidth <=
            document.documentElement.clientWidth + 1,
        ),
      )
      .toBe(true);
  });
}

test("invalid tool query falls back to merge", async ({ page }) => {
  await page.goto("/fr/app?tool=unknown");

  await expect(
    page.getByRole("heading", { name: "Assembler plusieurs PDF" }),
  ).toBeVisible();
});

test("diagnostics panel is local-first and exportable", async ({ page }) => {
  await page.goto("/fr/app?tool=edit");

  await expect(page.getByRole("heading", { name: "Diagnostics" })).toBeVisible();
  await expect(
    page.getByText("Stocké localement").filter({ visible: true }),
  ).toBeVisible();

  const downloadPromise = page.waitForEvent("download");
  await page
    .getByRole("button", { name: "Exporter le rapport diagnostics" })
    .filter({ visible: true })
    .click();
  const download = await downloadPromise;

  expect(download.suggestedFilename()).toMatch(/^oma-pdf-diagnostics-/);
});
