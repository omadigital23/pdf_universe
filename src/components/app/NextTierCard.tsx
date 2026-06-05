"use client";

import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";

export function NextTierCard() {
  const t = useTranslations("app");

  return (
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
  );
}
