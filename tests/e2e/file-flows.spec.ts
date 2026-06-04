import { expect, test } from "@playwright/test";
import { PDFDocument, StandardFonts } from "pdf-lib";
import { mkdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";

const pngBytes = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAIAAAD91JpzAAAAGElEQVR4nGP8z8AARLJgwiM3AwMAKqkCBf3xZ7sAAAAASUVORK5CYII=",
  "base64",
);

type DownloadLike = {
  path(): Promise<string | null>;
};

async function createPdf(filePath: string, pages: number) {
  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.HelveticaBold);

  for (let pageIndex = 0; pageIndex < pages; pageIndex += 1) {
    const page = pdf.addPage([595.28, 841.89]);
    page.drawText(`OMA PDF QA ${pageIndex + 1}`, {
      x: 72,
      y: 760,
      size: 18,
      font,
    });
  }

  await writeFile(filePath, await pdf.save());
}

async function expectDownloadedFile(download: DownloadLike) {
  const downloadPath = await download.path();

  expect(downloadPath).toBeTruthy();
  if (!downloadPath) return;

  const fileStat = await stat(downloadPath);
  expect(fileStat.size).toBeGreaterThan(100);
}

test("merge tool processes real generated PDFs", async ({ page }, testInfo) => {
  const dir = testInfo.outputPath("fixtures");
  await mkdir(dir, { recursive: true });
  const firstPdf = path.join(dir, "first.pdf");
  const secondPdf = path.join(dir, "second-large.pdf");
  await createPdf(firstPdf, 2);
  await createPdf(secondPdf, 12);

  await page.goto("/fr/app?tool=merge");
  await page.locator('input[type="file"]').setInputFiles([firstPdf, secondPdf]);

  const action = page
    .locator("button:not([aria-pressed])")
    .filter({ hasText: "Fusionner" });
  await expect(action).toBeEnabled();

  const downloadPromise = page.waitForEvent("download");
  await action.click();
  const download = await downloadPromise;

  expect(download.suggestedFilename()).toBe("first-fusion.pdf");
  await expectDownloadedFile(download);
  await expect(page.getByRole("status")).toContainText(/fusion/i, {
    timeout: 15_000,
  });
});

test("images-to-pdf tool converts real PNG files", async ({ page }, testInfo) => {
  const dir = testInfo.outputPath("fixtures");
  await mkdir(dir, { recursive: true });
  const firstImage = path.join(dir, "signature-source.png");
  const secondImage = path.join(dir, "invoice-source.png");
  await writeFile(firstImage, pngBytes);
  await writeFile(secondImage, pngBytes);

  await page.goto("/fr/app?tool=images-to-pdf");
  await page.locator('input[type="file"]').setInputFiles([firstImage, secondImage]);

  const action = page
    .locator("button:not([aria-pressed])")
    .filter({ hasText: /Cr.er le PDF/ });
  await expect(action).toBeEnabled();

  const downloadPromise = page.waitForEvent("download");
  await action.click();
  const download = await downloadPromise;

  expect(download.suggestedFilename()).toBe("images-en-pdf.pdf");
  await expectDownloadedFile(download);
  await expect(page.getByRole("status")).toContainText(/convert/i, {
    timeout: 15_000,
  });
});

test("pdf-to-images tool exports a generated PDF as a zip", async ({ page }, testInfo) => {
  const dir = testInfo.outputPath("fixtures");
  await mkdir(dir, { recursive: true });
  const sourcePdf = path.join(dir, "export.pdf");
  await createPdf(sourcePdf, 3);

  await page.goto("/fr/app?tool=pdf-to-images");
  await page.locator('input[type="file"]').setInputFiles(sourcePdf);

  const action = page
    .locator("button:not([aria-pressed])")
    .filter({ hasText: "Exporter en ZIP" });
  await expect(action).toBeEnabled();

  const downloadPromise = page.waitForEvent("download");
  await action.click();
  const download = await downloadPromise;

  expect(download.suggestedFilename()).toBe("export-images.zip");
  await expectDownloadedFile(download);
  await expect(page.getByRole("status")).toContainText(/export/i, {
    timeout: 15_000,
  });
});

test("sign tool applies a drawn signature to a generated PDF", async ({ page }, testInfo) => {
  const dir = testInfo.outputPath("fixtures");
  await mkdir(dir, { recursive: true });
  const sourcePdf = path.join(dir, "contract.pdf");
  await createPdf(sourcePdf, 1);

  await page.goto("/fr/app?tool=sign");
  await page.locator('input[type="file"]').setInputFiles(sourcePdf);

  const canvas = page.locator('canvas[role="img"]');
  const box = await canvas.boundingBox();
  expect(box).toBeTruthy();
  if (!box) return;

  await page.mouse.move(box.x + 40, box.y + 90);
  await page.mouse.down();
  await page.mouse.move(box.x + 140, box.y + 60);
  await page.mouse.move(box.x + 240, box.y + 110);
  await page.mouse.up();

  const action = page
    .locator("button:not([aria-pressed])")
    .filter({ hasText: "Signer" });
  await expect(action).toBeEnabled();

  const downloadPromise = page.waitForEvent("download");
  await action.click();
  const download = await downloadPromise;

  expect(download.suggestedFilename()).toBe("contract-signe.pdf");
  await expectDownloadedFile(download);
  await expect(page.getByRole("status")).toContainText(/Signature/i, {
    timeout: 15_000,
  });
});

test("edit tool writes text on a generated PDF", async ({ page }, testInfo) => {
  const dir = testInfo.outputPath("fixtures");
  await mkdir(dir, { recursive: true });
  const sourcePdf = path.join(dir, "invoice.pdf");
  await createPdf(sourcePdf, 2);

  await page.goto("/fr/app?tool=edit");
  await page.locator('input[type="file"]').setInputFiles(sourcePdf);
  await page.getByLabel("Texte").fill("Valide OMA");

  const action = page
    .locator("button:not([aria-pressed])")
    .filter({ hasText: "Modifier" });
  await expect(action).toBeEnabled();

  const downloadPromise = page.waitForEvent("download");
  await action.click();
  const download = await downloadPromise;

  expect(download.suggestedFilename()).toBe("invoice-modifie.pdf");
  await expectDownloadedFile(download);
  await expect(page.getByRole("status")).toContainText(/Texte/i, {
    timeout: 15_000,
  });
});

test("corrupted PDF surfaces a recoverable error state", async ({ page }, testInfo) => {
  const dir = testInfo.outputPath("fixtures");
  await mkdir(dir, { recursive: true });
  const corruptPdf = path.join(dir, "corrupt.pdf");
  await writeFile(corruptPdf, new Uint8Array([37, 80, 68, 70, 45, 98, 97, 100]));

  await page.goto("/fr/app?tool=pdf-to-images");
  await page.locator('input[type="file"]').setInputFiles(corruptPdf);

  const action = page
    .locator("button:not([aria-pressed])")
    .filter({ hasText: "Exporter en ZIP" });
  await expect(action).toBeEnabled();

  await action.click();

  await expect(page.getByRole("status")).toContainText(
    /PDF|Invalid|Erreur|Traitement|format/i,
    { timeout: 15_000 },
  );
});
