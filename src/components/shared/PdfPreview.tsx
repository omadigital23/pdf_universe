"use client";

/**
 * PdfPreview.tsx
 * Aperçu de la première page d'un fichier PDF via pdfjs-dist.
 * Masqué sur mobile, accessible via bouton toggle.
 */

import { useEffect, useState } from "react";
import { FileText, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { canvasToBlob, loadPdfJs } from "@/lib/pdf-utils";

type Props = {
  file: File | null;
};

export function PdfPreview({ file }: Props) {
  const t = useTranslations("app");
  const [preview, setPreview] = useState<string | null>(null);
  const [pages, setPages] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [mobileVisible, setMobileVisible] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let objectUrl: string | null = null;

    async function renderPreview() {
      if (!file) {
        setPreview(null);
        setPages(null);
        return;
      }

      setLoading(true);
      try {
        const pdfjs = await loadPdfJs();
        const pdf = await pdfjs.getDocument({
          data: new Uint8Array(await file.arrayBuffer()),
        }).promise;
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 0.85 });
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        if (!context) throw new Error(t("previewUnavailable"));

        canvas.width = Math.ceil(viewport.width);
        canvas.height = Math.ceil(viewport.height);
        await page.render({ canvas, canvasContext: context, viewport }).promise;
        const blob = await canvasToBlob(canvas);
        objectUrl = URL.createObjectURL(blob);

        if (!cancelled) {
          setPreview(objectUrl);
          setPages(pdf.numPages);
        }
        await pdf.cleanup();
      } catch {
        if (!cancelled) {
          setPreview(null);
          setPages(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    renderPreview();

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [file, t]);

  return (
    <aside className="rounded-lg border border-[var(--line)] bg-[var(--panel)] p-4">
      {/* En-tête avec toggle mobile */}
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-[var(--foreground)]">
          {t("previewHeading")}
        </h2>
        <div className="flex items-center gap-2">
          {pages && (
            <span className="rounded-md bg-[var(--panel-secondary)] px-2 py-1 text-xs font-medium text-[var(--muted)]">
              {pages} {t("previewPages")}
            </span>
          )}
          {/* Bouton visible uniquement sur mobile */}
          <button
            type="button"
            onClick={() => setMobileVisible((v) => !v)}
            className="rounded-md px-2 py-1 text-xs font-medium text-[var(--accent)] hover:bg-[var(--accent-muted)] xl:hidden"
            aria-expanded={mobileVisible}
          >
            {mobileVisible ? t("previewHide") : t("previewShow")}
          </button>
        </div>
      </div>

      {/* Zone d'aperçu — masquée sur mobile sauf si toggle activé */}
      <div className={mobileVisible ? "block" : "hidden xl:block"}>
        <div className="flex aspect-[3/4] items-center justify-center overflow-hidden rounded-md border border-[var(--line)] bg-[var(--panel-secondary)]">
          {loading ? (
            <Loader2
              className="h-6 w-6 animate-spin text-[var(--muted)]"
              aria-label={t("previewLoading")}
            />
          ) : preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={preview}
              alt={t("previewAlt")}
              className="h-full w-full object-contain"
            />
          ) : (
            <FileText
              className="h-9 w-9 text-[var(--line)]"
              aria-label={t("previewEmpty")}
            />
          )}
        </div>
      </div>
    </aside>
  );
}
