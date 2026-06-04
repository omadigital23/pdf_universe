import { rgb } from "pdf-lib";
import type { Placement } from "./types";

type PdfJsModule = typeof import("pdfjs-dist");

let pdfJsPromise: Promise<PdfJsModule> | null = null;

function fileSignature(file: File): string {
  return `${file.name}:${file.size}:${file.lastModified}`;
}

export function isPdfFile(file: File): boolean {
  return file.type === "application/pdf" || /\.pdf$/i.test(file.name);
}

export function isSupportedImageFile(file: File): boolean {
  return (
    file.type === "image/jpeg" ||
    file.type === "image/png" ||
    /\.(jpe?g|png)$/i.test(file.name)
  );
}

export function mergeUniqueFiles(current: File[], incoming: File[]): File[] {
  const seen = new Set(current.map(fileSignature));
  const next = [...current];

  for (const file of incoming) {
    const signature = fileSignature(file);
    if (!seen.has(signature)) {
      seen.add(signature);
      next.push(file);
    }
  }

  return next;
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} o`;

  const units = ["Ko", "Mo", "Go"] as const;
  let value = bytes / 1024;
  let index = 0;

  while (value >= 1024 && index < units.length - 1) {
    value /= 1024;
    index += 1;
  }

  return `${value.toFixed(value >= 10 ? 0 : 1)} ${units[index]}`;
}

export function safeBaseName(fileName: string): string {
  const cleaned = fileName
    .replace(/\.[^.]+$/, "")
    .replace(/[^\w.-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();

  return cleaned || "document";
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1_000);
}

export function downloadBytes(
  bytes: Uint8Array,
  filename: string,
  type = "application/pdf",
): void {
  downloadBlob(new Blob([bytes as BlobPart], { type }), filename);
}

export function canvasToBlob(
  canvas: HTMLCanvasElement,
  type = "image/png",
  quality?: number,
): Promise<Blob> {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Impossible de generer l'image."));
          return;
        }
        resolve(blob);
      },
      type,
      quality,
    );
  });
}

export function readSignatureCanvas(
  canvas: HTMLCanvasElement,
): HTMLCanvasElement | null {
  const context = canvas.getContext("2d");
  if (!context) return null;

  const image = context.getImageData(0, 0, canvas.width, canvas.height);
  let minX = canvas.width;
  let minY = canvas.height;
  let maxX = 0;
  let maxY = 0;

  for (let y = 0; y < canvas.height; y += 1) {
    for (let x = 0; x < canvas.width; x += 1) {
      const alpha = image.data[(y * canvas.width + x) * 4 + 3] ?? 0;
      if (alpha > 0) {
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }
  }

  if (minX > maxX || minY > maxY) return null;

  const padding = 28;
  const sourceX = Math.max(0, minX - padding);
  const sourceY = Math.max(0, minY - padding);
  const sourceWidth = Math.min(canvas.width - sourceX, maxX - minX + padding * 2);
  const sourceHeight = Math.min(
    canvas.height - sourceY,
    maxY - minY + padding * 2,
  );
  const output = document.createElement("canvas");
  output.width = sourceWidth;
  output.height = sourceHeight;
  output
    .getContext("2d")
    ?.drawImage(
      canvas,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,
      0,
      0,
      sourceWidth,
      sourceHeight,
    );

  return output;
}

export function hexToRgb(hex: string) {
  const value = hex.replace("#", "");

  if (!/^[0-9a-f]{6}$/i.test(value)) {
    throw new Error("Couleur hex invalide.");
  }

  const bigint = parseInt(value, 16);
  return rgb(
    ((bigint >> 16) & 255) / 255,
    ((bigint >> 8) & 255) / 255,
    (bigint & 255) / 255,
  );
}

export function getPlacement(
  placement: Placement,
  pageWidth: number,
  pageHeight: number,
  itemWidth: number,
  itemHeight: number,
): { x: number; y: number } {
  const margin = 48;
  const positions: Record<Placement, { x: number; y: number }> = {
    "bottom-right": { x: pageWidth - itemWidth - margin, y: margin },
    "bottom-left": { x: margin, y: margin },
    center: {
      x: (pageWidth - itemWidth) / 2,
      y: (pageHeight - itemHeight) / 2,
    },
    "top-right": {
      x: pageWidth - itemWidth - margin,
      y: pageHeight - itemHeight - margin,
    },
  };

  return {
    x: Math.max(16, positions[placement].x),
    y: Math.max(16, positions[placement].y),
  };
}

export async function loadPdfJs(): Promise<PdfJsModule> {
  if (!pdfJsPromise) {
    pdfJsPromise = import("pdfjs-dist").then((module) => {
      module.GlobalWorkerOptions.workerSrc = new URL(
        "pdfjs-dist/build/pdf.worker.mjs",
        import.meta.url,
      ).toString();
      return module;
    });
  }

  return pdfJsPromise;
}
