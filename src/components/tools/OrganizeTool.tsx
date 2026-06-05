"use client";

import JSZip from "jszip";
import { Scissors } from "lucide-react";
import { useTranslations } from "next-intl";
import { degrees, PDFDocument } from "pdf-lib";
import { useId, useState } from "react";
import { ActionButton } from "@/components/shared/ActionButton";
import { DropZone } from "@/components/shared/DropZone";
import { NumberField } from "@/components/shared/NumberField";
import { SelectField } from "@/components/shared/SelectField";
import {
  downloadBlob,
  downloadBytes,
  isPdfFile,
  parsePageSelection,
  safeBaseName,
  type PageSelectionError,
} from "@/lib/pdf-utils";
import type { ToolRuntimeProps } from "@/lib/types";

type OrganizeMode = "extract" | "delete" | "rotate" | "reorder" | "split";
type RotationValue = "90" | "180" | "270";

type Props = ToolRuntimeProps & {
  onFileChange?: (file: File | null) => void;
};

export function OrganizeTool({
  setStatus,
  isWorking,
  onMetricsChange,
  onFileChange,
}: Props) {
  const t = useTranslations("app");
  const to = useTranslations("app.tools.organize");
  const pagesId = useId();
  const [file, setFile] = useState<File | null>(null);
  const [mode, setMode] = useState<OrganizeMode>("extract");
  const [pageSpec, setPageSpec] = useState("");
  const [rotation, setRotation] = useState<RotationValue>("90");
  const [splitEvery, setSplitEvery] = useState(1);

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

  function selectionErrorText(error: PageSelectionError) {
    if (error === "empty") return to("errorPagesRequired");
    if (error === "bounds") return to("errorPagesBounds");
    return to("errorPagesSyntax");
  }

  async function loadPdf() {
    if (!file) throw new Error(to("errorMissing"));
    return PDFDocument.load(await file.arrayBuffer());
  }

  async function copyPages(source: PDFDocument, pages: number[]) {
    const target = await PDFDocument.create();
    const copiedPages = await target.copyPages(source, pages);
    for (const page of copiedPages) {
      target.addPage(page);
    }
    return target;
  }

  async function runOrganize() {
    if (!file) {
      setStatus({ kind: "error", text: to("errorMissing") });
      return;
    }

    try {
      setStatus({ kind: "working", text: to("working") });
      const source = await loadPdf();
      const pageCount = source.getPageCount();
      const baseName = safeBaseName(file.name);

      if (mode === "split") {
        const safeSplitEvery = Math.max(1, Math.floor(splitEvery));
        if (safeSplitEvery > pageCount) {
          setStatus({ kind: "error", text: to("errorSplitSize") });
          return;
        }

        const zip = new JSZip();
        let part = 1;
        for (let start = 0; start < pageCount; start += safeSplitEvery) {
          setStatus({
            kind: "working",
            text: `${to("working")} ${part}/${Math.ceil(pageCount / safeSplitEvery)}`,
          });
          const pages = Array.from(
            { length: Math.min(safeSplitEvery, pageCount - start) },
            (_, index) => start + index,
          );
          const target = await copyPages(source, pages);
          zip.file(
            `${baseName}-part-${String(part).padStart(2, "0")}.pdf`,
            await target.save(),
          );
          part += 1;
        }

        downloadBlob(await zip.generateAsync({ type: "blob" }), `${baseName}-split.zip`);
        setStatus({ kind: "success", text: to("successSplit") });
        return;
      }

      const selection = parsePageSelection(pageSpec, pageCount, {
        allowEmpty: mode === "rotate",
        dedupe: true,
      });

      if (!selection.ok) {
        setStatus({ kind: "error", text: selectionErrorText(selection.error) });
        return;
      }

      if (mode === "extract") {
        const target = await copyPages(source, selection.pages);
        downloadBytes(await target.save(), `${baseName}-extract.pdf`);
        setStatus({ kind: "success", text: to("successExtract") });
        return;
      }

      if (mode === "delete") {
        const pagesToDelete = new Set(selection.pages);
        const remainingPages = source
          .getPageIndices()
          .filter((pageIndex) => !pagesToDelete.has(pageIndex));

        if (remainingPages.length === 0) {
          setStatus({ kind: "error", text: to("errorDeleteAll") });
          return;
        }

        const target = await copyPages(source, remainingPages);
        downloadBytes(await target.save(), `${baseName}-delete.pdf`);
        setStatus({ kind: "success", text: to("successDelete") });
        return;
      }

      if (mode === "rotate") {
        const target = await copyPages(source, source.getPageIndices());
        const selectedPages = new Set(selection.pages);
        const rotationAngle = Number(rotation);

        for (const [index, page] of target.getPages().entries()) {
          if (!selectedPages.has(index)) continue;
          const currentAngle = page.getRotation().angle;
          page.setRotation(degrees((currentAngle + rotationAngle) % 360));
        }

        downloadBytes(await target.save(), `${baseName}-rotate.pdf`);
        setStatus({ kind: "success", text: to("successRotate") });
        return;
      }

      const target = await copyPages(source, selection.pages);
      downloadBytes(await target.save(), `${baseName}-reorder.pdf`);
      setStatus({ kind: "success", text: to("successReorder") });
    } catch (err) {
      setStatus({
        kind: "error",
        text: err instanceof Error ? err.message : t("statusError"),
      });
    }
  }

  const needsPageSpec = mode !== "split";

  return (
    <div className="grid gap-5">
      <DropZone
        title={to("dropTitle")}
        accept="application/pdf"
        disabled={isWorking}
        files={file ? [file] : []}
        onFiles={handleFiles}
        onRemove={removeFile}
      />

      <div className="grid gap-4 rounded-lg border border-[var(--line)] bg-[var(--panel-secondary)] p-3 lg:grid-cols-[1fr_1fr_auto] lg:items-end">
        <SelectField<OrganizeMode>
          label={to("mode")}
          value={mode}
          onChange={setMode}
          options={[
            { value: "extract", label: to("modeExtract") },
            { value: "delete", label: to("modeDelete") },
            { value: "rotate", label: to("modeRotate") },
            { value: "reorder", label: to("modeReorder") },
            { value: "split", label: to("modeSplit") },
          ]}
        />

        {needsPageSpec ? (
          <label
            className="grid gap-2 text-sm font-medium text-[var(--foreground)]"
            htmlFor={pagesId}
          >
            {to("pages")}
            <input
              id={pagesId}
              type="text"
              value={pageSpec}
              onChange={(event) => setPageSpec(event.target.value)}
              placeholder={mode === "rotate" ? to("pagesPlaceholderAll") : to("pagesPlaceholder")}
              disabled={isWorking}
              className="h-11 rounded-md border border-[var(--line)] bg-[var(--panel)] px-3 text-sm font-medium text-[var(--foreground)] outline-none shadow-[var(--shadow-inset)] transition placeholder:text-[var(--muted-light)] hover:border-[var(--line-strong)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-light)]"
            />
          </label>
        ) : (
          <NumberField
            label={to("splitEvery")}
            value={splitEvery}
            min={1}
            max={50}
            onChange={setSplitEvery}
          />
        )}

        {mode === "rotate" ? (
          <SelectField<RotationValue>
            label={to("rotation")}
            value={rotation}
            onChange={setRotation}
            options={[
              { value: "90", label: to("rotation90") },
              { value: "180", label: to("rotation180") },
              { value: "270", label: to("rotation270") },
            ]}
          />
        ) : null}

        <ActionButton
          icon={Scissors}
          disabled={!file || isWorking}
          loading={isWorking}
          onClick={runOrganize}
          className={mode === "rotate" ? "lg:col-start-3" : ""}
        >
          {to("action")}
        </ActionButton>
      </div>

      <p className="rounded-md border border-[var(--line)] bg-[var(--panel)] px-3 py-2 text-xs font-medium text-[var(--muted)]">
        {to("hint")}
      </p>
    </div>
  );
}
