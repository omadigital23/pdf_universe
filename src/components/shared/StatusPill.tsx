"use client";

/**
 * StatusPill.tsx v2 — pastille d'état animée avec icônes contextuelles.
 * Idle / working / success / error — aria-live pour accessibilité.
 */

import { BadgeCheck, CheckCircle2, Loader2, XCircle } from "lucide-react";
import clsx from "clsx";
import { motion, AnimatePresence } from "motion/react";
import type { StudioStatus } from "@/lib/types";

const CONFIG = {
  idle: {
    icon: BadgeCheck,
    class: "border-[var(--line)] bg-[var(--panel)] text-[var(--muted)]",
  },
  working: {
    icon: Loader2,
    class: "border-[var(--warning-line)] bg-[var(--warning-bg)] text-[var(--warning)]",
  },
  success: {
    icon: CheckCircle2,
    class: "border-[var(--success-line)] bg-[var(--success-bg)] text-[var(--success)]",
  },
  error: {
    icon: XCircle,
    class: "border-[var(--danger-line)] bg-[var(--danger-bg)] text-[var(--danger)]",
  },
};

export function StatusPill({ status }: { status: StudioStatus }) {
  const cfg = CONFIG[status.kind];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`${status.kind}-${status.text}`}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        initial={{ opacity: 0, scale: 0.95, y: 4 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -4 }}
        transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
        className={clsx(
          "flex max-w-full shrink-0 items-center gap-2 rounded-md border px-3 py-2 text-xs font-medium",
          cfg.class,
        )}
      >
        <cfg.icon
          className={clsx("h-3.5 w-3.5 shrink-0", status.kind === "working" && "animate-spin")}
          aria-hidden="true"
        />
        <span className="max-w-[14rem] truncate sm:max-w-[240px]">
          {status.text}
        </span>
      </motion.div>
    </AnimatePresence>
  );
}
