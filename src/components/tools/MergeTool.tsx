"use client";

/**
 * MergeTool.tsx
 * Outil de fusion de plusieurs PDF en un seul document.
 */

import { FileStack } from "lucide-react";
import { useTranslations } from "next-intl";
import { PDFDocument } from "pdf-lib";
import { useState } from "react";
import { DropZone } from "@/components/shared/DropZone";
import { ActionButton } from "@/components/shared/ActionButton";
import {
  downloadBytes,
  isPdfFile,
  mergeUniqueFiles,
  safeBaseName,
} from "@/lib/pdf-utils";
import type { ToolRuntimeProps } from "@/lib/types";

export function MergeTool({
  setStatus,
  isWorking,
  onMetricsChange,
}: ToolRuntimeProps) {
  const t = useTranslations("app");
  const tm = useTranslations("app.tools.merge");
  const [files, setFiles] = useState<File[]>([]);

  /** Ajoute uniquement les PDF valides à la liste */
  function handleFiles(incoming: File[]) {
    const accepted = incoming.filter(isPdfFile);
    setFiles((prev) => {
      const next = mergeUniqueFiles(prev, accepted);
      onMetricsChange({ pdfCount: next.length, imageCount: 0 });
      return next;
    });
    if (accepted.length !== incoming.length) {
      setStatus({ kind: "error", text: t("dropIncompatible") });
    }
  }

  function removeFile(index: number) {
    setFiles((prev) => {
      const next = prev.filter((_, currentIndex) => currentIndex !== index);
      onMetricsChange({ pdfCount: next.length, imageCount: 0 });
      return next;
    });
  }

  async function mergePdfs() {
    if (files.length < 2) {
      setStatus({ kind: "error", text: tm("errorMin") });
      return;
    }

    try {
      setStatus({ kind: "working", text: tm("working") });
      const merged = await PDFDocument.create();

      for (const [index, file] of files.entries()) {
        setStatus({
          kind: "working",
          text: `${tm("working")} ${index + 1}/${files.length}`,
        });
        const src = await PDFDocument.load(await file.arrayBuffer());
        const copied = await merged.copyPages(src, src.getPageIndices());
        copied.forEach((p) => merged.addPage(p));
      }

      const bytes = await merged.save();
      const firstFile = files[0];
      if (!firstFile) throw new Error(tm("errorMin"));
      const base = safeBaseName(firstFile.name);
      downloadBytes(bytes, `${base}-fusion.pdf`);
      setStatus({ kind: "success", text: `${files.length} ${tm("success")}` });
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
        title={tm("dropTitle")}
        accept="application/pdf"
        multiple
        disabled={isWorking}
        files={files}
        onFiles={handleFiles}
        onRemove={removeFile}
      />
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[var(--line)] bg-[var(--panel-secondary)] p-3">
        <span className="text-sm text-[var(--muted)]">
          {files.length} {tm("queueInfo")}
        </span>
        <ActionButton
          icon={FileStack}
          disabled={files.length < 2 || isWorking}
          loading={isWorking}
          onClick={mergePdfs}
        >
          {tm("action")}
        </ActionButton>
      </div>
    </div>
  );
}
