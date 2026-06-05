"use client";

import { DiagnosticsPanel } from "@/components/app/DiagnosticsPanel";
import { NextTierCard } from "@/components/app/NextTierCard";
import { SessionPanel } from "@/components/app/SessionPanel";
import { PdfPreview } from "@/components/shared/PdfPreview";

type Props = {
  locale: string;
  previewFile: File | null;
  pdfCount: number;
  imgCount: number;
  onReset: () => void;
};

export function AppRightRail({
  locale,
  previewFile,
  pdfCount,
  imgCount,
  onReset,
}: Props) {
  return (
    <div className="hidden w-72 shrink-0 flex-col gap-4 xl:flex">
      <PdfPreview file={previewFile} />
      <SessionPanel pdfCount={pdfCount} imgCount={imgCount} onReset={onReset} />
      <DiagnosticsPanel locale={locale} />
      <NextTierCard />
    </div>
  );
}
