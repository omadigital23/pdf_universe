"use client";

import { useMemo, useState } from "react";
import { BarChart3, Download, RefreshCcw, ShieldCheck, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { downloadBlob } from "@/lib/pdf-utils";
import {
  buildDiagnosticsReport,
  clearTelemetry,
  readTelemetrySnapshot,
  recordTelemetryEvent,
  type TelemetrySnapshot,
} from "@/lib/local-telemetry";
import type { ToolId } from "@/lib/types";

type Props = {
  locale: string;
};

const APP_VERSION = "0.1.0";
const TOOL_IDS: ToolId[] = [
  "merge",
  "images-to-pdf",
  "pdf-to-images",
  "sign",
  "edit",
];

export function DiagnosticsPanel({ locale }: Props) {
  const t = useTranslations("app.diagnostics");
  const toolLabels = useTranslations("app.tools");
  const [snapshot, setSnapshot] = useState<TelemetrySnapshot>(() =>
    readTelemetrySnapshot(),
  );

  function refresh() {
    setSnapshot(readTelemetrySnapshot());
  }

  const summary = useMemo(() => {
    const events = snapshot.events;
    return {
      events: events.length,
      errors: events.filter(
        (event) =>
          event.name === "process_error" || event.name === "runtime_error",
      ).length,
      successes: events.filter((event) => event.name === "process_success").length,
      tools: TOOL_IDS.map((toolId) => ({
        id: toolId,
        label: toolLabels(`${toolKey(toolId)}.label`),
        count: events.filter(
          (event) => event.name === "tool_select" && event.tool === toolId,
        ).length,
      })),
    };
  }, [snapshot, toolLabels]);

  function exportReport() {
    const report = buildDiagnosticsReport(locale, APP_VERSION);
    recordTelemetryEvent({ name: "diagnostics_export" });
    refresh();
    downloadBlob(
      new Blob([JSON.stringify(report, null, 2)], {
        type: "application/json",
      }),
      `oma-pdf-diagnostics-${new Date().toISOString().slice(0, 10)}.json`,
    );
  }

  function clearReport() {
    clearTelemetry();
    refresh();
  }

  return (
    <section className="rounded-md border border-[var(--line)] bg-[var(--panel)] p-4 shadow-[var(--shadow-sm)]">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[var(--accent-muted)] text-[var(--accent)]">
            <BarChart3 className="h-4 w-4" aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
              {t("title")}
            </h2>
            <p className="text-xs text-[var(--muted)]">{t("privacy")}</p>
          </div>
        </div>
        <ShieldCheck className="h-4 w-4 text-[var(--accent)]" aria-hidden="true" />
      </div>

      <dl className="grid grid-cols-3 gap-2 text-sm">
        <Metric label={t("events")} value={summary.events} />
        <Metric label={t("successes")} value={summary.successes} />
        <Metric label={t("errors")} value={summary.errors} />
      </dl>

      <div className="mt-3 grid gap-1.5">
        {summary.tools.map((tool) => (
          <div
            key={tool.id}
            className="flex items-center justify-between gap-2 rounded-md bg-[var(--panel-secondary)] px-3 py-2 text-xs"
          >
            <span className="truncate font-medium text-[var(--muted)]">
              {tool.label}
            </span>
            <span className="font-bold tabular-nums text-[var(--foreground)]">
              {tool.count}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2">
        <button
          type="button"
          onClick={refresh}
          className="inline-flex h-9 items-center justify-center rounded-md border border-[var(--line)] bg-[var(--panel)] text-[var(--muted)] transition hover:text-[var(--foreground)] focus-visible:outline-2"
          aria-label={t("refresh")}
        >
          <RefreshCcw className="h-4 w-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={exportReport}
          className="inline-flex h-9 items-center justify-center rounded-md border border-[var(--line)] bg-[var(--panel)] text-[var(--muted)] transition hover:text-[var(--foreground)] focus-visible:outline-2"
          aria-label={t("export")}
        >
          <Download className="h-4 w-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={clearReport}
          className="inline-flex h-9 items-center justify-center rounded-md border border-[var(--line)] bg-[var(--panel)] text-[var(--muted)] transition hover:text-[var(--danger)] focus-visible:outline-2"
          aria-label={t("clear")}
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md bg-[var(--panel-secondary)] px-3 py-2">
      <dt className="truncate text-[10px] font-bold uppercase tracking-[0.08em] text-[var(--muted)]">
        {label}
      </dt>
      <dd className="text-base font-black tabular-nums text-[var(--foreground)]">
        {value}
      </dd>
    </div>
  );
}

function toolKey(toolId: ToolId): string {
  const keys: Record<ToolId, string> = {
    merge: "merge",
    "images-to-pdf": "imagesToPdf",
    "pdf-to-images": "pdfToImages",
    sign: "sign",
    edit: "edit",
  };

  return keys[toolId];
}
