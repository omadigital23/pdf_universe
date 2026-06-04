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
import { downloadBytes, safeBaseName } from "@/lib/pdf-utils";
import type { StudioStatus } from "@/lib/types";

type Props = {
  setStatus: (status: StudioStatus) => void;
  isWorking: boolean;
};

export function MergeTool({ setStatus, isWorking }: Props) {
  const t = useTranslations("app");
  const tm = useTranslations("app.tools.merge");
  const [files, setFiles] = useState<File[]>([]);

  /** Ajoute uniquement les PDF valides à la liste */
  function handleFiles(incoming: File[]) {
    const accepted = incoming.filter(
      (f) => f.type === "application/pdf" || f.name.endsWith(".pdf"),
    );
    setFiles((prev) => [...prev, ...accepted]);
    if (accepted.length !== incoming.length) {
      setStatus({ kind: "error", text: t("dropIncompatible") });
    }
  }

  async function mergePdfs() {
    if (files.length < 2) {
      setStatus({ kind: "error", text: tm("errorMin") });
      return;
    }

    try {
      setStatus({ kind: "working", text: tm("working") });
      const merged = await PDFDocument.create();

      for (const file of files) {
        const src = await PDFDocument.load(await file.arrayBuffer());
        const copied = await merged.copyPages(src, src.getPageIndices());
        copied.forEach((p) => merged.addPage(p));
      }

      const bytes = await merged.save();
      const base = safeBaseName(files[0].name);
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
        files={files}
        onFiles={handleFiles}
      />
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[var(--line)] bg-[var(--panel-secondary)] p-3">
        <span className="text-sm text-[var(--muted)]">
          {files.length} {tm("queueInfo")}
        </span>
        <ActionButton
          icon={FileStack}
          disabled={files.length < 2 || isWorking}
          onClick={mergePdfs}
        >
          {tm("action")}
        </ActionButton>
      </div>
    </div>
  );
}
