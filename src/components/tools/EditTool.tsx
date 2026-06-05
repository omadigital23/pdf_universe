"use client";

/**
 * EditTool.tsx
 * Ajoute du texte personnalisé sur une ou toutes les pages d'un PDF.
 */

import { Edit3 } from "lucide-react";
import { useTranslations } from "next-intl";
import { PDFDocument, StandardFonts } from "pdf-lib";
import { useState } from "react";
import { DropZone } from "@/components/shared/DropZone";
import { ActionButton } from "@/components/shared/ActionButton";
import { NumberField } from "@/components/shared/NumberField";
import { SelectField } from "@/components/shared/SelectField";
import {
  downloadBytes,
  getPlacement,
  hexToRgb,
  isPdfFile,
  safeBaseName,
} from "@/lib/pdf-utils";
import type { EditTarget, Placement, ToolRuntimeProps } from "@/lib/types";

type Props = ToolRuntimeProps & {
  onFileChange?: (file: File | null) => void;
};

const COLORS = [
  { value: "#18181b", key: "colorBlack" as const },
  { value: "#0f766e", key: "colorTeal" as const },
  { value: "#b91c1c", key: "colorRed" as const },
  { value: "#1d4ed8", key: "colorBlue" as const },
];

export function EditTool({
  setStatus,
  isWorking,
  onMetricsChange,
  onFileChange,
}: Props) {
  const t = useTranslations("app");
  const te = useTranslations("app.tools.edit");
  const ts = useTranslations("app.tools.sign");
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState(te("textDefault"));
  const [target, setTarget] = useState<EditTarget>("all");
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(24);
  const [color, setColor] = useState("#0f766e");
  const [placement, setPlacement] = useState<Placement>("bottom-right");

  function handleFiles(incoming: File[]) {
    const accepted =
      incoming.find(isPdfFile) ?? null;
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

  async function editPdf() {
    if (!file) {
      setStatus({ kind: "error", text: te("errorMissing") });
      return;
    }
    if (!text.trim()) {
      setStatus({ kind: "error", text: te("errorText") });
      return;
    }

    try {
      setStatus({ kind: "working", text: te("working") });
      const pdf = await PDFDocument.load(await file.arrayBuffer());
      const font = await pdf.embedFont(StandardFonts.HelveticaBold);
      const pages = pdf.getPages();
      if (pages.length === 0) throw new Error(t("statusError"));
      const selectedPage = pages[Math.min(Math.max(page, 1), pages.length) - 1];
      if (!selectedPage) throw new Error(t("statusError"));
      const selected = target === "all" ? pages : [selectedPage];
      const fill = hexToRgb(color);

      for (const p of selected) {
        const textW = font.widthOfTextAtSize(text, size);
        const { x, y } = getPlacement(
          placement,
          p.getWidth(),
          p.getHeight(),
          textW,
          size,
        );
        p.drawText(text, { x, y, size, font, color: fill, opacity: 0.92 });
      }

      const bytes = await pdf.save();
      downloadBytes(bytes, `${safeBaseName(file.name)}-modifie.pdf`);
      setStatus({ kind: "success", text: te("success") });
    } catch (err) {
      setStatus({
        kind: "error",
        text: err instanceof Error ? err.message : t("statusError"),
      });
    }
  }

  // Labels de placement récupérés via useTranslations au niveau du composant
  const placements: { value: Placement; label: string }[] = [
    { value: "bottom-right", label: ts("posBottomRight") },
    { value: "bottom-left", label: ts("posBottomLeft") },
    { value: "center", label: ts("posCenter") },
    { value: "top-right", label: ts("posTopRight") },
  ];

  return (
    <div className="grid gap-5">
      <DropZone
        title={te("dropTitle")}
        accept="application/pdf"
        disabled={isWorking}
        files={file ? [file] : []}
        onFiles={handleFiles}
        onRemove={removeFile}
      />

      <div className="grid gap-4 rounded-lg border border-[var(--line)] bg-[var(--panel-secondary)] p-3">
        {/* Champ texte */}
        <label className="grid gap-2 text-sm font-medium text-[var(--foreground)]">
          {te("textLabel")}
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="h-11 rounded-md border border-[var(--line)] bg-[var(--panel)] px-3 text-sm font-medium text-[var(--foreground)] outline-none shadow-[var(--shadow-inset)] transition hover:border-[var(--line-strong)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-light)]"
          />
        </label>

        {/* Options */}
        <div className="grid gap-4 md:grid-cols-5 md:items-end">
          <SelectField<EditTarget>
            label={te("pages")}
            value={target}
            onChange={setTarget}
            options={[
              { value: "all", label: te("pagesAll") },
              { value: "single", label: te("pagesSingle") },
            ]}
          />
          <NumberField label={te("page")} value={page} min={1} onChange={setPage} />
          <NumberField
            label={te("size")}
            value={size}
            min={8}
            max={96}
            onChange={setSize}
          />
          <SelectField<Placement>
            label={te("position")}
            value={placement}
            onChange={setPlacement}
            options={placements}
          />
          {/* Couleur */}
          <label className="grid gap-2 text-sm font-medium text-[var(--foreground)]">
            {te("color")}
            <select
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="h-11 rounded-md border border-[var(--line)] bg-[var(--panel)] px-3 text-sm font-medium text-[var(--foreground)] outline-none shadow-[var(--shadow-inset)] transition hover:border-[var(--line-strong)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-light)]"
            >
              {COLORS.map((c) => (
                <option key={c.value} value={c.value}>
                  {te(c.key)}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="flex justify-end">
          <ActionButton
            icon={Edit3}
            disabled={!file || isWorking}
            loading={isWorking}
            onClick={editPdf}
          >
            {te("action")}
          </ActionButton>
        </div>
      </div>
    </div>
  );
}
