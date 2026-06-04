"use client";

/**
 * PdfToImagesTool.tsx
 * Exporte toutes les pages d'un PDF en images PNG compressées dans un ZIP.
 */

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
  loadPdfJs,
  safeBaseName,
} from "@/lib/pdf-utils";
import type { StudioStatus } from "@/lib/types";

type Props = {
  setStatus: (status: StudioStatus) => void;
  isWorking: boolean;
  /** Callback pour transmettre le fichier sélectionné au composant parent (aperçu) */
  onFileChange?: (file: File | null) => void;
};

export function PdfToImagesTool({ setStatus, isWorking, onFileChange }: Props) {
  const t = useTranslations("app");
  const tp = useTranslations("app.tools.pdfToImages");
  const [file, setFile] = useState<File | null>(null);
  const [renderScale, setRenderScale] = useState(2);

  function handleFiles(incoming: File[]) {
    const accepted =
      incoming.find(
        (f) => f.type === "application/pdf" || f.name.endsWith(".pdf"),
      ) ?? null;
    setFile(accepted);
    onFileChange?.(accepted);
    if (!accepted && incoming.length > 0) {
      setStatus({ kind: "error", text: t("dropIncompatibleSingle") });
    }
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
      const zip = new JSZip();
      const baseName = safeBaseName(file.name);

      for (let n = 1; n <= pdf.numPages; n += 1) {
        const page = await pdf.getPage(n);
        const viewport = page.getViewport({ scale: renderScale });
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Canvas indisponible.");
        canvas.width = Math.ceil(viewport.width);
        canvas.height = Math.ceil(viewport.height);
        await page.render({ canvas, canvasContext: ctx, viewport }).promise;
        const blob = await canvasToBlob(canvas);
        zip.file(`${baseName}-page-${String(n).padStart(3, "0")}.png`, blob);
      }

      await pdf.cleanup();
      const zipBlob = await zip.generateAsync({ type: "blob" });
      downloadBlob(zipBlob, `${baseName}-images.zip`);
      setStatus({
        kind: "success",
        text: `${pdf.numPages} ${tp("success")}`,
      });
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
        files={file ? [file] : []}
        onFiles={handleFiles}
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
          onClick={exportImages}
        >
          {tp("action")}
        </ActionButton>
      </div>
    </div>
  );
}
