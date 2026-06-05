"use client";

import { FileImage } from "lucide-react";
import { useTranslations } from "next-intl";
import JSZip from "jszip";
import { useState } from "react";
import { DropZone } from "@/components/shared/DropZone";
import { ActionButton } from "@/components/shared/ActionButton";
import { NumberField } from "@/components/shared/NumberField";
import {
  canvasToBlob,
  downloadBlob,
  isPdfFile,
  loadPdfJs,
  safeBaseName,
} from "@/lib/pdf-utils";
import type { ToolRuntimeProps } from "@/lib/types";

type Props = ToolRuntimeProps & {
  onFileChange?: (file: File | null) => void;
};

export function PdfToImagesTool({
  setStatus,
  isWorking,
  onMetricsChange,
  onFileChange,
}: Props) {
  const t = useTranslations("app");
  const tp = useTranslations("app.tools.pdfToImages");
  const [file, setFile] = useState<File | null>(null);
  const [renderScale, setRenderScale] = useState(2);

  function handleFiles(incoming: File[]) {
    const accepted = incoming.find(isPdfFile) ?? null;
    setFile(accepted);
    onFileChange?.(accepted);
    onMetricsChange({ pdfCount: accepted ? 1 : 0, imageCount: 0 });

    if (!accepted && incoming.length > 0) {
      setStatus({ kind: "error", text: t("dropIncompatibleSingle") });
    }
  }

  function removeFile() {
    setFile(null);
    onFileChange?.(null);
    onMetricsChange({ pdfCount: 0, imageCount: 0 });
  }

  async function exportImages() {
    if (!file) {
      setStatus({ kind: "error", text: tp("errorMin") });
      return;
    }

    try {
      setStatus({ kind: "working", text: tp("working") });
      const pdfjs = await loadPdfJs();
      const pdf = await pdfjs.getDocument({
        data: new Uint8Array(await file.arrayBuffer()),
      }).promise;
      const pageCount = pdf.numPages;
      const zip = new JSZip();
      const baseName = safeBaseName(file.name);

      for (let pageNumber = 1; pageNumber <= pageCount; pageNumber += 1) {
        setStatus({
          kind: "working",
          text: `${tp("working")} ${pageNumber}/${pageCount}`,
        });
        const page = await pdf.getPage(pageNumber);
        const viewport = page.getViewport({ scale: renderScale });
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Canvas indisponible.");
        canvas.width = Math.ceil(viewport.width);
        canvas.height = Math.ceil(viewport.height);
        await page.render({ canvas, canvasContext: ctx, viewport }).promise;
        const blob = await canvasToBlob(canvas);
        zip.file(
          `${baseName}-page-${String(pageNumber).padStart(3, "0")}.png`,
          blob,
        );
      }

      await pdf.cleanup();
      const zipBlob = await zip.generateAsync({ type: "blob" });
      setStatus({
        kind: "success",
        text: `${pageCount} ${tp("success")}`,
      });
      downloadBlob(zipBlob, `${baseName}-images.zip`);
    } catch (err) {
      setStatus({
        kind: "error",
        text: err instanceof Error ? err.message : t("statusError"),
      });
    }
  }

  return (
    <div className="grid gap-5">
      <DropZone
        title={tp("dropTitle")}
        accept="application/pdf"
        disabled={isWorking}
        files={file ? [file] : []}
        onFiles={handleFiles}
        onRemove={removeFile}
      />
      <div className="grid gap-4 rounded-lg border border-[var(--line)] bg-[var(--panel-secondary)] p-3 sm:grid-cols-[1fr_auto] sm:items-end">
        <NumberField
          label={tp("quality")}
          value={renderScale}
          min={1}
          max={4}
          step={0.5}
          onChange={setRenderScale}
        />
        <ActionButton
          icon={FileImage}
          disabled={!file || isWorking}
          loading={isWorking}
          onClick={exportImages}
        >
          {tp("action")}
        </ActionButton>
      </div>
    </div>
  );
}
