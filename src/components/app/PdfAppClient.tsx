"use client";

/**
 * PdfAppClient.tsx
 * Interface principale de l'outil PDF.
 * Layout : sidebar outils (desktop) | tabs (mobile) + panneau principal + colonne droite.
 */

import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Suspense, useEffect, useRef, useState } from "react";
import { RotateCcw, FileStack, ImagePlus, Images, PenLine, Type, Plus, ChevronRight, Scissors } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { AppErrorBoundary } from "@/components/app/AppErrorBoundary";
import { DiagnosticsPanel } from "@/components/app/DiagnosticsPanel";
import { StatusPill } from "@/components/shared/StatusPill";
import { PdfPreview } from "@/components/shared/PdfPreview";
import { MergeTool } from "@/components/tools/MergeTool";
import { OrganizeTool } from "@/components/tools/OrganizeTool";
import { ImagesToPdfTool } from "@/components/tools/ImagesToPdfTool";
import { PdfToImagesTool } from "@/components/tools/PdfToImagesTool";
import { SignTool } from "@/components/tools/SignTool";
import { EditTool } from "@/components/tools/EditTool";
import { OmaLogo } from "@/components/shared/OmaLogo";
import { recordTelemetryEvent } from "@/lib/local-telemetry";
import type { StudioMetricsPatch, StudioStatus, ToolId } from "@/lib/types";

/* Configuration des outils */
const TOOLS: Array<{
  id: ToolId;
  icon: typeof FileStack;
  labelKey: string;
  shortKey: string;
  colorVar: string;
  bgVar: string;
}> = [
  {
    id: "merge",
    icon: FileStack,
    labelKey: "tools.merge.label",
    shortKey: "tools.merge.short",
    colorVar: "var(--tool-merge-accent)",
    bgVar: "var(--tool-merge-bg)",
  },
  {
    id: "organize",
    icon: Scissors,
    labelKey: "tools.organize.label",
    shortKey: "tools.organize.short",
    colorVar: "var(--tool-organize-accent)",
    bgVar: "var(--tool-organize-bg)",
  },
  {
    id: "images-to-pdf",
    icon: ImagePlus,
    labelKey: "tools.imagesToPdf.label",
    shortKey: "tools.imagesToPdf.short",
    colorVar: "var(--tool-images-accent)",
    bgVar: "var(--tool-images-bg)",
  },
  {
    id: "pdf-to-images",
    icon: Images,
    labelKey: "tools.pdfToImages.label",
    shortKey: "tools.pdfToImages.short",
    colorVar: "var(--tool-pdf-images-accent)",
    bgVar: "var(--tool-pdf-images-bg)",
  },
  {
    id: "sign",
    icon: PenLine,
    labelKey: "tools.sign.label",
    shortKey: "tools.sign.short",
    colorVar: "var(--tool-sign-accent)",
    bgVar: "var(--tool-sign-bg)",
  },
  {
    id: "edit",
    icon: Type,
    labelKey: "tools.edit.label",
    shortKey: "tools.edit.short",
    colorVar: "var(--tool-edit-accent)",
    bgVar: "var(--tool-edit-bg)",
  },
];

type Props = { locale: string };

function AppInner({ locale }: Props) {
  const t = useTranslations("app");
  const router = useRouter();
  const searchParams = useSearchParams();

  /* Outil actif depuis l'URL */
  const toolParam = searchParams.get("tool") as ToolId | null;
  const activeTool: ToolId =
    toolParam && TOOLS.some((x) => x.id === toolParam) ? toolParam : "merge";
  const activeMeta = TOOLS.find((x) => x.id === activeTool)!;

  const [status, setStatus] = useState<StudioStatus>({
    kind: "idle",
    text: t("statusReady"),
  });
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [pdfCount, setPdfCount] = useState(0);
  const [imgCount, setImgCount] = useState(0);
  const [resetKey, setResetKey] = useState(0);
  const lastStatusKindRef = useRef<StudioStatus["kind"]>("idle");
  const didRecordOpenRef = useRef(false);

  const isWorking = status.kind === "working";

  useEffect(() => {
    if (didRecordOpenRef.current) return;
    didRecordOpenRef.current = true;
    recordTelemetryEvent({ name: "app_open", tool: activeTool });
  }, [activeTool]);

  function handleStatusChange(nextStatus: StudioStatus) {
    const previousKind = lastStatusKindRef.current;
    const metrics = { pdfCount, imageCount: imgCount };

    if (nextStatus.kind === "working" && previousKind !== "working") {
      recordTelemetryEvent({
        name: "process_start",
        tool: activeTool,
        statusKind: nextStatus.kind,
        ...metrics,
      });
    }

    if (nextStatus.kind === "success") {
      recordTelemetryEvent({
        name: "process_success",
        tool: activeTool,
        statusKind: nextStatus.kind,
        ...metrics,
      });
    }

    if (nextStatus.kind === "error") {
      recordTelemetryEvent({
        name: "process_error",
        tool: activeTool,
        statusKind: nextStatus.kind,
        error: nextStatus.text.slice(0, 160),
        ...metrics,
      });
    }

    lastStatusKindRef.current = nextStatus.kind;
    setStatus(nextStatus);
  }

  function selectTool(id: ToolId) {
    if (id === activeTool) return;
    setPreviewFile(null);
    setPdfCount(0);
    setImgCount(0);
    lastStatusKindRef.current = "idle";
    setStatus({ kind: "idle", text: t("statusReady") });
    recordTelemetryEvent({ name: "tool_select", tool: id });
    router.push(`/${locale}/app?tool=${id}`, { scroll: false });
  }

  function updateMetrics(metrics: StudioMetricsPatch) {
    const previousTotal = pdfCount + imgCount;
    const nextPdfCount = metrics.pdfCount ?? pdfCount;
    const nextImageCount = metrics.imageCount ?? imgCount;
    const nextTotal = nextPdfCount + nextImageCount;

    if (typeof metrics.pdfCount === "number") {
      setPdfCount(metrics.pdfCount);
    }
    if (typeof metrics.imageCount === "number") {
      setImgCount(metrics.imageCount);
    }

    if (nextTotal > previousTotal) {
      recordTelemetryEvent({
        name: "files_selected",
        tool: activeTool,
        pdfCount: nextPdfCount,
        imageCount: nextImageCount,
      });
    }

    if (nextTotal < previousTotal) {
      recordTelemetryEvent({
        name: "files_removed",
        tool: activeTool,
        pdfCount: nextPdfCount,
        imageCount: nextImageCount,
      });
    }
  }

  function resetSession() {
    setPreviewFile(null);
    setPdfCount(0);
    setImgCount(0);
    setResetKey((k) => k + 1);
    lastStatusKindRef.current = "idle";
    setStatus({ kind: "idle", text: t("statusReady") });
    recordTelemetryEvent({ name: "session_reset", tool: activeTool });
  }

  return (
    <div className="mx-auto max-w-[1400px] overflow-x-hidden px-4 py-6 pb-24 sm:px-6 sm:py-8 lg:pb-8">

      {/* ── LAYOUT PRINCIPAL ──────────────────────────────────── */}
      <div className="flex gap-5">

        {/* ── SIDEBAR OUTILS — desktop uniquement ────────────── */}
        <aside
          className="hidden lg:flex flex-col gap-1.5 w-52 shrink-0"
          aria-label={t("toolsNavigation")}
        >
          {/* Logo mini */}
          <div className="mb-3 flex items-center gap-2 px-3 pb-3 border-b border-[var(--line)]">
            <OmaLogo size={24} />
            <span className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">
              {t("toolsHeading")}
            </span>
          </div>

          {TOOLS.map((tool) => {
            const isActive = tool.id === activeTool;
            return (
              <button
                key={tool.id}
                type="button"
                onClick={() => selectTool(tool.id)}
                aria-pressed={isActive}
                className={`group flex items-center gap-3 rounded-md border px-3 py-2.5 text-left transition duration-200 ${
                  isActive
                    ? "border-[var(--line)] text-[var(--foreground)]"
                    : "border-transparent text-[var(--muted)] hover:border-[var(--line)] hover:bg-[var(--panel-secondary)] hover:text-[var(--foreground)]"
                }`}
                style={
                  isActive
                    ? { background: tool.bgVar, boxShadow: "var(--shadow-xs)" }
                    : undefined
                }
              >
                {/* Icône */}
                <span
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md transition-colors"
                  style={
                    isActive
                      ? { background: tool.colorVar }
                      : { background: "var(--panel-secondary)" }
                  }
                >
                  <tool.icon
                    className="h-4 w-4"
                    style={{ color: isActive ? "var(--panel)" : "var(--muted)" }}
                    aria-hidden="true"
                  />
                </span>

                <span className="flex-1 min-w-0">
                  <span className="block text-sm font-medium truncate">
                    {t(tool.labelKey)}
                  </span>
                  <span className="block text-xs text-[var(--muted-light)] truncate">
                    {t(tool.shortKey)}
                  </span>
                </span>

                {isActive && (
                  <ChevronRight
                    className="h-3.5 w-3.5 shrink-0"
                    style={{ color: tool.colorVar }}
                    aria-hidden="true"
                  />
                )}
              </button>
            );
          })}
        </aside>

        {/* ── CONTENU PRINCIPAL ──────────────────────────────── */}
        <div className="flex-1 min-w-0 flex flex-col gap-4">

          {/* Tabs outils — mobile */}
          <nav
            className="fixed bottom-0 left-0 right-0 z-40 flex gap-1 overflow-hidden border-t border-[var(--line)] bg-[var(--panel-glass)] px-2 py-2 backdrop-blur-md lg:hidden"
            aria-label={t("toolsNavigation")}
          >
            {TOOLS.map((tool) => {
              const isActive = tool.id === activeTool;
              return (
                <button
                  key={tool.id}
                  type="button"
                  onClick={() => selectTool(tool.id)}
                  aria-label={t(tool.labelKey)}
                  aria-pressed={isActive}
                  aria-current={isActive ? "page" : undefined}
                  className={`flex min-h-14 items-center justify-center gap-1.5 overflow-hidden rounded-md border py-1.5 font-bold transition duration-200 ${
                    isActive
                      ? "min-w-[6.75rem] flex-1 border-transparent px-3 text-xs text-[var(--panel)] shadow-[var(--shadow-xs)]"
                      : "w-12 flex-none border-[var(--line)] bg-[var(--panel-secondary)] px-1.5 text-[var(--muted)]"
                  }`}
                  style={isActive ? { background: tool.colorVar } : undefined}
                >
                  <tool.icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span className={isActive ? "max-w-full truncate" : "sr-only"}>
                    {t(tool.labelKey)}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Panneau outil */}
          <div
            className="overflow-hidden rounded-md border border-[var(--line)] bg-[var(--panel)] animate-fade-in"
            style={{ boxShadow: "var(--shadow-md)" }}
          >
            {/* En-tête outil */}
            <div
              className="flex flex-col items-start justify-between gap-3 border-b border-[var(--line)] px-4 py-4 sm:flex-row sm:items-center sm:px-6"
              style={{ background: activeMeta.bgVar }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-md"
                  style={{ background: activeMeta.colorVar }}
                >
                  <activeMeta.icon className="h-4.5 w-4.5 text-[var(--panel)]" aria-hidden="true" />
                </div>
                <div>
                  <p
                    className="text-xs font-bold uppercase tracking-wider"
                    style={{ color: activeMeta.colorVar }}
                  >
                    {t(activeMeta.labelKey)}
                  </p>
                  <h1 className="text-base font-semibold text-[var(--foreground)]">
                    {t(activeMeta.shortKey)}
                  </h1>
                </div>
              </div>
              <StatusPill status={status} />
            </div>

            {/* Corps outil — animé à la transition */}
            <AnimatePresence initial={false} mode="wait">
              <motion.div
                key={`${activeTool}-${resetKey}`}
                className="p-4 sm:p-6"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              >
                {activeTool === "merge" && (
                  <MergeTool
                    setStatus={handleStatusChange}
                    isWorking={isWorking}
                    onMetricsChange={updateMetrics}
                  />
                )}
                {activeTool === "organize" && (
                  <OrganizeTool
                    setStatus={handleStatusChange}
                    isWorking={isWorking}
                    onMetricsChange={updateMetrics}
                    onFileChange={setPreviewFile}
                  />
                )}
                {activeTool === "images-to-pdf" && (
                  <ImagesToPdfTool
                    setStatus={handleStatusChange}
                    isWorking={isWorking}
                    onMetricsChange={updateMetrics}
                  />
                )}
                {activeTool === "pdf-to-images" && (
                  <PdfToImagesTool
                    setStatus={handleStatusChange}
                    isWorking={isWorking}
                    onMetricsChange={updateMetrics}
                    onFileChange={setPreviewFile}
                  />
                )}
                {activeTool === "sign" && (
                  <SignTool
                    setStatus={handleStatusChange}
                    isWorking={isWorking}
                    onMetricsChange={updateMetrics}
                    onFileChange={setPreviewFile}
                  />
                )}
                {activeTool === "edit" && (
                  <EditTool
                    setStatus={handleStatusChange}
                    isWorking={isWorking}
                    onMetricsChange={updateMetrics}
                    onFileChange={setPreviewFile}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="xl:hidden">
            <PdfPreview file={previewFile} />
          </div>

          <div className="xl:hidden">
            <DiagnosticsPanel locale={locale} />
          </div>
        </div>

        {/* ── COLONNE DROITE ─────────────────────────────────── */}
        <div className="hidden xl:flex flex-col gap-4 w-72 shrink-0">

          {/* Aperçu PDF */}
          <PdfPreview file={previewFile} />

          {/* Session */}
          <div
            className="rounded-md border border-[var(--line)] bg-[var(--panel)] p-4"
            style={{ boxShadow: "var(--shadow-sm)" }}
          >
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                {t("sessionHeading")}
              </h2>
              <button
                type="button"
                onClick={resetSession}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-[var(--muted)] hover:bg-[var(--panel-secondary)] hover:text-[var(--foreground)] transition-colors focus-visible:outline-2"
                aria-label={t("sessionReset")}
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>
            <div className="space-y-1.5 text-sm">
              {[
                { label: t("sessionPdf"), value: pdfCount },
                { label: t("sessionImages"), value: imgCount },
                { label: t("sessionMode"), value: t("sessionModeValue") },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="flex items-center justify-between gap-3 rounded-lg bg-[var(--panel-secondary)] px-3 py-2"
                >
                  <span className="text-[var(--muted)]">{label}</span>
                  <span className="font-semibold text-[var(--foreground)] tabular-nums">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <DiagnosticsPanel locale={locale} />

          {/* Teaser Pro */}
          <div className="rounded-md border border-[var(--accent-light)] bg-[var(--accent-muted)] p-4">
            <div className="mb-2 flex items-center gap-2">
              <Plus className="h-4 w-4 text-[var(--accent)]" aria-hidden="true" />
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--accent)]">
                {t("nextTierTitle")}
              </span>
            </div>
            <p className="text-xs leading-relaxed text-[var(--accent-ink)]">
              {t("nextTierDesc")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PdfAppClient({ locale }: Props) {
  const t = useTranslations("app");

  return (
    <AppErrorBoundary>
      <Suspense
        fallback={
          <div className="flex h-64 items-center justify-center text-sm text-[var(--muted)]">
            {t("loading")}
          </div>
        }
      >
        <AppInner locale={locale} />
      </Suspense>
    </AppErrorBoundary>
  );
}
