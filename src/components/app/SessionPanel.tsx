"use client";

import { RotateCcw } from "lucide-react";
import { useTranslations } from "next-intl";

type Props = {
  pdfCount: number;
  imgCount: number;
  onReset: () => void;
};

export function SessionPanel({ pdfCount, imgCount, onReset }: Props) {
  const t = useTranslations("app");

  return (
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
          onClick={onReset}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-[var(--muted)] transition-colors hover:bg-[var(--panel-secondary)] hover:text-[var(--foreground)] focus-visible:outline-2"
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
            <span className="font-semibold tabular-nums text-[var(--foreground)]">
              {value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
