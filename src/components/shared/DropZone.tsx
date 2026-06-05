"use client";

/**
 * DropZone.tsx v2 — zone de dépôt de fichiers premium.
 * Drag & drop avec état visuel hover, liste fichiers avec taille, bouton suppression.
 */

import { useId, useState, type ChangeEvent, type DragEvent } from "react";
import { UploadCloud, X, FileText } from "lucide-react";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "motion/react";
import { formatBytes } from "@/lib/pdf-utils";

type Props = {
  title: string;
  accept: string;
  multiple?: boolean;
  disabled?: boolean;
  files: File[];
  onFiles: (files: File[]) => void;
  onRemove: (index: number) => void;
};

export function DropZone({
  title,
  accept,
  multiple,
  disabled,
  files,
  onFiles,
  onRemove,
}: Props) {
  const id = useId();
  const t = useTranslations("app");
  const [isDragging, setIsDragging] = useState(false);

  function handleInput(event: ChangeEvent<HTMLInputElement>) {
    if (disabled) return;
    onFiles(Array.from(event.target.files ?? []));
    event.target.value = "";
  }

  function handleDragOver(e: DragEvent<HTMLLabelElement>) {
    e.preventDefault();
    if (disabled) return;
    setIsDragging(true);
  }

  function handleDragLeave() {
    setIsDragging(false);
  }

  function handleDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    if (disabled) return;
    setIsDragging(false);
    onFiles(Array.from(event.dataTransfer.files));
  }

  return (
    <div className="space-y-3">
      {/* Zone de dépôt */}
      <label
        htmlFor={id}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          flex min-h-40 flex-col items-center justify-center gap-3
          rounded-md border border-dashed px-6 py-8 text-center
          transition-all duration-200
          ${disabled
            ? "cursor-not-allowed border-[var(--line)] bg-[var(--panel-secondary)] opacity-75"
            : isDragging
              ? "scale-[1.01] cursor-pointer border-[var(--accent)] bg-[var(--accent-muted)] shadow-[var(--shadow-sm)]"
              : "cursor-pointer border-[var(--line)] bg-[var(--panel-secondary)] hover:border-[var(--accent)] hover:bg-[var(--accent-pale)]"
          }
          focus-within:border-[var(--accent)] focus-within:bg-[var(--accent-pale)]
        `}
      >
        <span
          className={`
            flex h-12 w-12 items-center justify-center rounded-md border transition-colors
            ${isDragging
              ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--panel)]"
              : "border-[var(--accent-light)] bg-[var(--accent-muted)] text-[var(--accent)]"
            }
          `}
        >
          <UploadCloud className="h-5 w-5" aria-hidden="true" />
        </span>

        <div>
          <p className="text-sm font-semibold text-[var(--foreground)]">{title}</p>
          <p className="mt-1 text-xs text-[var(--muted)]">{t("dropDragOrBrowse")}</p>
        </div>

        <input
          id={id}
          className="sr-only"
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          onChange={handleInput}
          aria-label={title}
        />
      </label>

      {/* Liste des fichiers sélectionnés */}
      {files.length > 0 && (
        <div className="overflow-hidden rounded-md border border-[var(--line)] bg-[var(--panel)]" style={{ boxShadow: "var(--shadow-xs)" }}>
          <AnimatePresence initial={false}>
            {files.map((file, index) => (
              <motion.div
                key={`${file.name}-${file.lastModified}-${index}`}
                layout
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ type: "spring", stiffness: 350, damping: 32 }}
                className="overflow-hidden flex items-center gap-3 border-b border-[var(--line)] px-4 py-3 text-sm last:border-b-0"
              >
                {/* Icône fichier */}
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-[var(--line)] bg-[var(--panel-secondary)]">
                  <FileText className="h-4 w-4 text-[var(--muted)]" aria-hidden="true" />
                </span>

                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-[var(--foreground)]">{file.name}</p>
                  <p className="text-xs text-[var(--muted-light)]">{formatBytes(file.size)}</p>
                </div>

                <button
                  type="button"
                  aria-label={`${t("dropRemove")} ${file.name}`}
                  onClick={() => onRemove(index)}
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-[var(--muted)] transition-colors hover:bg-[var(--danger-bg)] hover:text-[var(--danger)] focus-visible:outline-2"
                >
                  <X className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
