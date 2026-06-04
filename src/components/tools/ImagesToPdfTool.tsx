"use client";

/**
 * ImagesToPdfTool.tsx
 * Convertit une liste d'images JPG/PNG en un seul document PDF.
 */

import { FileText } from "lucide-react";
import { useTranslations } from "next-intl";
import { PDFDocument } from "pdf-lib";
import { useState } from "react";
import { DropZone } from "@/components/shared/DropZone";
import { ActionButton } from "@/components/shared/ActionButton";
import { SelectField } from "@/components/shared/SelectField";
import { downloadBytes } from "@/lib/pdf-utils";
import type { PageMode, StudioStatus } from "@/lib/types";

type Props = {
  setStatus: (status: StudioStatus) => void;
  isWorking: boolean;
};

// Dimensions A4 en points PDF
const A4_PORTRAIT: [number, number] = [595.28, 841.89];

export function ImagesToPdfTool({ setStatus, isWorking }: Props) {
  const t = useTranslations("app");
  const ti = useTranslations("app.tools.imagesToPdf");
  const [files, setFiles] = useState<File[]>([]);
  const [pageMode, setPageMode] = useState<PageMode>("a4-portrait");

  function handleFiles(incoming: File[]) {
    const accepted = incoming.filter(
      (f) =>
        f.type === "image/jpeg" ||
        f.type === "image/png" ||
        /\.(jpe?g|png)$/i.test(f.name),
    );
    setFiles((prev) => [...prev, ...accepted]);
    if (accepted.length !== incoming.length) {
      setStatus({ kind: "error", text: t("dropIncompatible") });
    }
  }

  async function convert() {
    if (files.length === 0) {
      setStatus({ kind: "error", text: ti("errorMin") });
      return;
    }

    try {
      setStatus({ kind: "working", text: ti("working") });
      const pdf = await PDFDocument.create();
      const pageSize =
        pageMode === "a4-portrait"
          ? A4_PORTRAIT
          : pageMode === "a4-landscape"
            ? ([A4_PORTRAIT[1], A4_PORTRAIT[0]] as [number, number])
            : null;

      for (const file of files) {
        const bytes = new Uint8Array(await file.arrayBuffer());
        const isPng =
          file.type === "image/png" || file.name.toLowerCase().endsWith(".png");
        const embedded = isPng
          ? await pdf.embedPng(bytes)
          : await pdf.embedJpg(bytes);

        const [pageW, pageH] = pageSize ?? [embedded.width, embedded.height];
        const page = pdf.addPage([pageW, pageH]);

        if (pageMode === "original") {
          page.drawImage(embedded, { x: 0, y: 0, width: pageW, height: pageH });
        } else {
          const margin = 32;
          const scale = Math.min(
            (pageW - margin * 2) / embedded.width,
            (pageH - margin * 2) / embedded.height,
          );
          const drawW = embedded.width * scale;
          const drawH = embedded.height * scale;
          page.drawImage(embedded, {
            x: (pageW - drawW) / 2,
            y: (pageH - drawH) / 2,
            width: drawW,
            height: drawH,
          });
        }
      }

      const bytes = await pdf.save();
      downloadBytes(bytes, "images-en-pdf.pdf");
      setStatus({
        kind: "success",
        text: `${files.length} ${ti("success")}`,
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
        title={ti("dropTitle")}
        accept="image/jpeg,image/png"
        multiple
        files={files}
        onFiles={handleFiles}
      />
      <div className="grid gap-4 rounded-lg border border-[var(--line)] bg-[var(--panel-secondary)] p-3 sm:grid-cols-[1fr_auto] sm:items-end">
        <SelectField<PageMode>
          label={ti("pageFormat")}
          value={pageMode}
          onChange={setPageMode}
          options={[
            { value: "a4-portrait", label: ti("a4Portrait") },
            { value: "a4-landscape", label: ti("a4Landscape") },
            { value: "original", label: ti("original") },
          ]}
        />
        <ActionButton
          icon={FileText}
          disabled={files.length === 0 || isWorking}
          onClick={convert}
        >
          {ti("action")}
        </ActionButton>
      </div>
    </div>
  );
}
