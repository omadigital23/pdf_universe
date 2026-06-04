"use client";

/**
 * SignTool.tsx
 * Permet de dessiner une signature sur canvas et de l'apposer sur un PDF.
 * Supporte le pointer (souris + stylet + tactile) via PointerEvents.
 */

import { Eraser, PenLine } from "lucide-react";
import { useTranslations } from "next-intl";
import { PDFDocument } from "pdf-lib";
import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { DropZone } from "@/components/shared/DropZone";
import { ActionButton } from "@/components/shared/ActionButton";
import { NumberField } from "@/components/shared/NumberField";
import { SelectField } from "@/components/shared/SelectField";
import {
  canvasToBlob,
  downloadBytes,
  getPlacement,
  readSignatureCanvas,
  safeBaseName,
} from "@/lib/pdf-utils";
import type { Placement, StudioStatus } from "@/lib/types";

type Props = {
  setStatus: (status: StudioStatus) => void;
  isWorking: boolean;
  onFileChange?: (file: File | null) => void;
};

export function SignTool({ setStatus, isWorking, onFileChange }: Props) {
  const t = useTranslations("app");
  const ts = useTranslations("app.tools.sign");
  const [file, setFile] = useState<File | null>(null);
  const [page, setPage] = useState(1);
  const [width, setWidth] = useState(180);
  const [placement, setPlacement] = useState<Placement>("bottom-right");
  const [dirty, setDirty] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef(false);

  // Initialisation du contexte canvas au montage
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx) return;
    ctx.lineWidth = 6;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = getComputedStyle(document.documentElement)
      .getPropertyValue("--foreground")
      .trim();
  }, []);

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

  function resetSignature() {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setDirty(false);
  }

  function getPoint(e: ReactPointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (canvas.width / rect.width),
      y: (e.clientY - rect.top) * (canvas.height / rect.height),
    };
  }

  function startDrawing(e: ReactPointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const point = getPoint(e);
    if (!canvas || !ctx || !point) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    isDrawingRef.current = true;
    ctx.beginPath();
    ctx.moveTo(point.x, point.y);
  }

  function draw(e: ReactPointerEvent<HTMLCanvasElement>) {
    if (!isDrawingRef.current) return;
    const ctx = canvasRef.current?.getContext("2d");
    const point = getPoint(e);
    if (!ctx || !point) return;
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
    setDirty(true);
  }

  function stopDrawing(e: ReactPointerEvent<HTMLCanvasElement>) {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    e.currentTarget.releasePointerCapture(e.pointerId);
  }

  async function signPdf() {
    const canvas = canvasRef.current;
    if (!file || !canvas) {
      setStatus({ kind: "error", text: ts("errorMissing") });
      return;
    }
    const cropped = readSignatureCanvas(canvas);
    if (!dirty || !cropped) {
      setStatus({ kind: "error", text: ts("errorNoSign") });
      return;
    }

    try {
      setStatus({ kind: "working", text: ts("working") });
      const pdf = await PDFDocument.load(await file.arrayBuffer());
      const pages = pdf.getPages();
      const target = pages[Math.min(Math.max(page, 1), pages.length) - 1];
      const sigBytes = await (await canvasToBlob(cropped)).arrayBuffer();
      const sigImg = await pdf.embedPng(sigBytes);
      const pageW = target.getWidth();
      const pageH = target.getHeight();
      const w = Math.min(width, pageW - 64);
      const h = w * (sigImg.height / sigImg.width);
      const { x, y } = getPlacement(placement, pageW, pageH, w, h);
      target.drawImage(sigImg, { x, y, width: w, height: h });
      const bytes = await pdf.save();
      downloadBytes(bytes, `${safeBaseName(file.name)}-signe.pdf`);
      setStatus({ kind: "success", text: ts("success") });
    } catch (err) {
      setStatus({
        kind: "error",
        text: err instanceof Error ? err.message : t("statusError"),
      });
    }
  }

  const placements: { value: Placement; label: string }[] = [
    { value: "bottom-right", label: ts("posBottomRight") },
    { value: "bottom-left", label: ts("posBottomLeft") },
    { value: "center", label: ts("posCenter") },
    { value: "top-right", label: ts("posTopRight") },
  ];

  return (
    <div className="grid gap-5">
      <DropZone
        title={ts("dropTitle")}
        accept="application/pdf"
        files={file ? [file] : []}
        onFiles={handleFiles}
      />

      {/* Zone de dessin de la signature */}
      <div className="rounded-lg border border-[var(--line)] bg-[var(--panel-secondary)] p-3">
        <div className="mb-3 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <span className="text-sm font-semibold text-[var(--foreground)]">
            {ts("signatureLabel")}
          </span>
          <button
            type="button"
            onClick={resetSignature}
            aria-label={ts("clear")}
            className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-md border border-[var(--line)] bg-[var(--panel)] px-3 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--panel-secondary)] focus-visible:outline-2 sm:w-auto"
          >
            <Eraser className="h-4 w-4" aria-hidden="true" />
            {ts("clear")}
          </button>
        </div>
        <canvas
          ref={canvasRef}
          width={1100}
          height={320}
          role="img"
          aria-label={ts("canvasAriaLabel")}
          onPointerDown={startDrawing}
          onPointerMove={draw}
          onPointerUp={stopDrawing}
          onPointerCancel={stopDrawing}
          className="h-44 w-full touch-none rounded-md border border-[var(--line)] bg-[var(--panel)] cursor-crosshair"
          style={{ touchAction: "none" }}
        />
      </div>

      {/* Options de placement */}
      <div className="grid gap-4 rounded-lg border border-[var(--line)] bg-[var(--panel-secondary)] p-3 md:grid-cols-4 md:items-end">
        <NumberField label={ts("page")} value={page} min={1} onChange={setPage} />
        <NumberField
          label={ts("width")}
          value={width}
          min={80}
          max={420}
          onChange={setWidth}
        />
        <SelectField<Placement>
          label={ts("position")}
          value={placement}
          onChange={setPlacement}
          options={placements}
        />
        <ActionButton
          icon={PenLine}
          disabled={!file || isWorking}
          onClick={signPdf}
        >
          {ts("action")}
        </ActionButton>
      </div>
    </div>
  );
}
