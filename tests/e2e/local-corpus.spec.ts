import { expect, test, type Download, type Page } from "@playwright/test";
import { readdir, stat } from "node:fs/promises";
import path from "node:path";

type CorpusFile = {
  filePath: string;
  name: string;
  size: number;
};

const corpusDir = process.env.OMA_PDF_QA_CORPUS_DIR;

test.describe("local PDF corpus QA", () => {
  test.skip(
    !corpusDir,
    "Set OMA_PDF_QA_CORPUS_DIR to run local private-document QA.",
  );
  test.describe.configure({ mode: "serial" });
  test.setTimeout(120_000);

  let pdfs: CorpusFile[] = [];
  let images: CorpusFile[] = [];

  test.beforeAll(async () => {
    const corpus = await loadCorpusFiles(requireCorpusDir());
    pdfs = corpus.pdfs;
    images = corpus.images;
  });

  test("converts sampled corpus images to PDF", async ({ page }) => {
    expect(images.length).toBeGreaterThanOrEqual(2);
    const sampledImages = largestFiles(images, 4);

    await openTool(page, "images-to-pdf", "JPG ou PNG vers document");
    await page
      .locator('input[type="file"]')
      .setInputFiles(sampledImages.map((file) => file.filePath));

    const action = page
      .locator("button:not([aria-pressed])")
      .filter({ hasText: /Cr.er le PDF/ });
    await expect(action).toBeEnabled({ timeout: 10_000 });

    const downloadPromise = page.waitForEvent("download");
    await action.click();
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toBe("images-en-pdf.pdf");
    await expectDownloadedFile(download);
    await expect(page.getByRole("status")).toContainText(/convert/i, {
      timeout: 60_000,
    });
  });

  test("merges sampled corpus PDFs", async ({ page }) => {
    expect(pdfs.length).toBeGreaterThanOrEqual(2);
    const sampledPdfs = largestFiles(pdfs, 3);

    await openTool(page, "merge", "Assembler plusieurs PDF");
    await page
      .locator('input[type="file"]')
      .setInputFiles(sampledPdfs.map((file) => file.filePath));

    const action = page
      .locator("button:not([aria-pressed])")
      .filter({ hasText: "Fusionner" });
    await expect(action).toBeEnabled({ timeout: 10_000 });

    const downloadPromise = page.waitForEvent("download");
    await action.click();
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toMatch(/-fusion\.pdf$/);
    await expectDownloadedFile(download);
    await expect(page.getByRole("status")).toContainText(/fusion/i, {
      timeout: 90_000,
    });
  });

  test("exports a real corpus PDF to images", async ({ page }) => {
    expect(pdfs.length).toBeGreaterThanOrEqual(1);
    const sourcePdf = smallestFiles(pdfs, 1)[0];
    expect(sourcePdf).toBeDefined();
    if (!sourcePdf) return;

    await openTool(page, "pdf-to-images", "Exporter toutes les pages");
    await page.locator('input[type="file"]').setInputFiles(sourcePdf.filePath);

    const action = page
      .locator("button:not([aria-pressed])")
      .filter({ hasText: "Exporter en ZIP" });
    await expect(action).toBeEnabled({ timeout: 10_000 });

    const downloadPromise = page.waitForEvent("download");
    await action.click();
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toMatch(/-images\.zip$/);
    await expectDownloadedFile(download);
    await expect(page.getByRole("status")).toContainText(/export/i, {
      timeout: 90_000,
    });
  });

  test("signs and edits a real corpus PDF", async ({ page }) => {
    expect(pdfs.length).toBeGreaterThanOrEqual(1);
    const sourcePdf = smallestFiles(pdfs, 1)[0];
    expect(sourcePdf).toBeDefined();
    if (!sourcePdf) return;

    await openTool(page, "sign", "Signature visuelle");
    await page.locator('input[type="file"]').setInputFiles(sourcePdf.filePath);

    const canvas = page.locator('canvas[role="img"]');
    const box = await canvas.boundingBox();
    expect(box).toBeTruthy();
    if (!box) return;

    await page.mouse.move(box.x + 40, box.y + 90);
    await page.mouse.down();
    await page.mouse.move(box.x + 160, box.y + 55);
    await page.mouse.move(box.x + 280, box.y + 112);
    await page.mouse.up();

    const signAction = page
      .locator("button:not([aria-pressed])")
      .filter({ hasText: "Signer" });
    await expect(signAction).toBeEnabled({ timeout: 10_000 });

    const signDownloadPromise = page.waitForEvent("download");
    await signAction.click();
    const signedDownload = await signDownloadPromise;

    expect(signedDownload.suggestedFilename()).toMatch(/-signe\.pdf$/);
    await expectDownloadedFile(signedDownload);
    await expect(page.getByRole("status")).toContainText(/Signature/i, {
      timeout: 60_000,
    });

    await openTool(page, "edit", "Ajouter un texte");
    await page.locator('input[type="file"]').setInputFiles(sourcePdf.filePath);
    await page.getByLabel("Texte").fill("Valide OMA");

    const editAction = page
      .locator("button:not([aria-pressed])")
      .filter({ hasText: "Modifier" });
    await expect(editAction).toBeEnabled({ timeout: 10_000 });

    const editDownloadPromise = page.waitForEvent("download");
    await editAction.click();
    const editedDownload = await editDownloadPromise;

    expect(editedDownload.suggestedFilename()).toMatch(/-modifie\.pdf$/);
    await expectDownloadedFile(editedDownload);
    await expect(page.getByRole("status")).toContainText(/Texte/i, {
      timeout: 60_000,
    });
  });
});

function requireCorpusDir(): string {
  if (!corpusDir) {
    throw new Error("OMA_PDF_QA_CORPUS_DIR is required.");
  }

  return corpusDir;
}

async function loadCorpusFiles(dir: string) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries
      .filter((entry) => entry.isFile())
      .map(async (entry) => {
        const filePath = path.join(dir, entry.name);
        const fileStat = await stat(filePath);
        return {
          filePath,
          name: entry.name,
          size: fileStat.size,
        };
      }),
  );

  return {
    pdfs: files.filter((file) => /\.pdf$/i.test(file.name)),
    images: files.filter((file) => /\.(jpe?g|png)$/i.test(file.name)),
  };
}

async function openTool(page: Page, tool: string, heading: string) {
  await page.goto(`/fr/app?tool=${tool}`);
  await expect(page.getByRole("heading", { name: heading })).toBeVisible({
    timeout: 15_000,
  });
}

function largestFiles(files: CorpusFile[], count: number): CorpusFile[] {
  return [...files].sort((a, b) => b.size - a.size).slice(0, count);
}

function smallestFiles(files: CorpusFile[], count: number): CorpusFile[] {
  return [...files].sort((a, b) => a.size - b.size).slice(0, count);
}

async function expectDownloadedFile(download: Download) {
  const downloadPath = await download.path();

  expect(downloadPath).toBeTruthy();
  if (!downloadPath) return;

  const fileStat = await stat(downloadPath);
  expect(fileStat.size).toBeGreaterThan(100);
}
