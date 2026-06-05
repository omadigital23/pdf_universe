import type { ToolId } from "@/lib/types";

export const DEFAULT_TOOL_ID: ToolId = "merge";

export const TOOL_IDS = [
  "merge",
  "organize",
  "images-to-pdf",
  "pdf-to-images",
  "sign",
  "edit",
] as const satisfies readonly ToolId[];

export const TOOL_TRANSLATION_KEYS = {
  merge: {
    key: "merge",
    label: "tools.merge.label",
    short: "tools.merge.short",
  },
  organize: {
    key: "organize",
    label: "tools.organize.label",
    short: "tools.organize.short",
  },
  "images-to-pdf": {
    key: "imagesToPdf",
    label: "tools.imagesToPdf.label",
    short: "tools.imagesToPdf.short",
  },
  "pdf-to-images": {
    key: "pdfToImages",
    label: "tools.pdfToImages.label",
    short: "tools.pdfToImages.short",
  },
  sign: {
    key: "sign",
    label: "tools.sign.label",
    short: "tools.sign.short",
  },
  edit: {
    key: "edit",
    label: "tools.edit.label",
    short: "tools.edit.short",
  },
} as const satisfies Record<
  ToolId,
  { key: string; label: string; short: string }
>;

export function isToolId(value: string | null): value is ToolId {
  return TOOL_IDS.some((toolId) => toolId === value);
}
