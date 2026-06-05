import { describe, expect, it } from "vitest";
import {
  formatBytes,
  getPlacement,
  isPdfFile,
  isSupportedImageFile,
  mergeUniqueFiles,
  parsePageSelection,
  safeBaseName,
} from "./pdf-utils";

function mockFile(file: {
  name: string;
  type: string;
  size?: number;
  lastModified?: number;
}): File {
  return {
    name: file.name,
    type: file.type,
    size: file.size ?? 1024,
    lastModified: file.lastModified ?? 1,
  } as File;
}

describe("pdf-utils", () => {
  it("formats bytes with French units", () => {
    expect(formatBytes(12)).toBe("12 o");
    expect(formatBytes(1536)).toBe("1.5 Ko");
    expect(formatBytes(12_000_000)).toBe("11 Mo");
  });

  it("creates stable output basenames", () => {
    expect(safeBaseName("Contrat signé.pdf")).toBe("contrat-sign");
    expect(safeBaseName(".pdf")).toBe("document");
  });

  it("detects supported file types", () => {
    expect(isPdfFile(mockFile({ name: "scan.PDF", type: "" }))).toBe(true);
    expect(isSupportedImageFile(mockFile({ name: "photo.jpeg", type: "" }))).toBe(true);
    expect(isSupportedImageFile(mockFile({ name: "photo.webp", type: "" }))).toBe(false);
  });

  it("deduplicates files by name, size and lastModified", () => {
    const file = mockFile({ name: "a.pdf", type: "application/pdf" });
    const duplicate = mockFile({ name: "a.pdf", type: "application/pdf" });
    const other = mockFile({
      name: "a.pdf",
      type: "application/pdf",
      lastModified: 2,
    });

    expect(mergeUniqueFiles([file], [duplicate, other])).toEqual([file, other]);
  });

  it("keeps placement inside page bounds", () => {
    expect(getPlacement("bottom-right", 200, 200, 80, 40)).toEqual({
      x: 72,
      y: 48,
    });
    expect(getPlacement("center", 200, 200, 80, 40)).toEqual({
      x: 60,
      y: 80,
    });
  });

  it("parses page lists and ranges as zero-based indexes", () => {
    expect(parsePageSelection("1, 3-5, 3", 8)).toEqual({
      ok: true,
      pages: [0, 2, 3, 4],
    });
  });

  it("supports empty selections when all pages are allowed", () => {
    expect(parsePageSelection("", 3, { allowEmpty: true })).toEqual({
      ok: true,
      pages: [0, 1, 2],
    });
  });

  it("rejects invalid page selections", () => {
    expect(parsePageSelection("", 3)).toEqual({ ok: false, error: "empty" });
    expect(parsePageSelection("2-1", 3)).toEqual({
      ok: false,
      error: "syntax",
    });
    expect(parsePageSelection("4", 3)).toEqual({
      ok: false,
      error: "bounds",
    });
  });
});
