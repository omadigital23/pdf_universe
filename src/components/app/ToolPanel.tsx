"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useTranslations } from "next-intl";
import { StatusPill } from "@/components/shared/StatusPill";
import { ToolRenderer } from "@/components/app/ToolRenderer";
import type { ToolNavItem } from "@/components/app/tool-ui";
import type {
  StudioMetricsPatch,
  StudioStatus,
  ToolId,
} from "@/lib/types";

type Props = {
  activeTool: ToolId;
  activeMeta: ToolNavItem;
  resetKey: number;
  status: StudioStatus;
  isWorking: boolean;
  setStatus: (status: StudioStatus) => void;
  onMetricsChange: (metrics: StudioMetricsPatch) => void;
  onFileChange: (file: File | null) => void;
};

export function ToolPanel({
  activeTool,
  activeMeta,
  resetKey,
  status,
  isWorking,
  setStatus,
  onMetricsChange,
  onFileChange,
}: Props) {
  const t = useTranslations("app");
  const Icon = activeMeta.icon;
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const previousToolRef = useRef<ToolId | null>(null);

  useEffect(() => {
    if (previousToolRef.current === null) {
      previousToolRef.current = activeTool;
      return;
    }

    if (previousToolRef.current !== activeTool) {
      previousToolRef.current = activeTool;
      headingRef.current?.focus({ preventScroll: true });
    }
  }, [activeTool]);

  return (
    <div
      className="overflow-hidden rounded-md border border-[var(--line)] bg-[var(--panel)] animate-fade-in"
      style={{ boxShadow: "var(--shadow-md)" }}
    >
      <div
        className="flex flex-col items-start justify-between gap-3 border-b border-[var(--line)] px-4 py-4 sm:flex-row sm:items-center sm:px-6"
        style={{ background: activeMeta.bgVar }}
      >
        <div className="flex items-center gap-3">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-md"
            style={{ background: activeMeta.colorVar }}
          >
            <Icon className="h-4.5 w-4.5 text-[var(--panel)]" aria-hidden="true" />
          </div>
          <div>
            <p
              className="text-xs font-bold uppercase tracking-wider"
              style={{ color: activeMeta.colorVar }}
            >
              {t(activeMeta.labelKey)}
            </p>
            <h1
              ref={headingRef}
              tabIndex={-1}
              className="text-base font-semibold text-[var(--foreground)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-light)]"
            >
              {t(activeMeta.shortKey)}
            </h1>
          </div>
        </div>
        <StatusPill status={status} />
      </div>

      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={`${activeTool}-${resetKey}`}
          className="p-4 sm:p-6"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
        >
          <ToolRenderer
            activeTool={activeTool}
            setStatus={setStatus}
            isWorking={isWorking}
            onMetricsChange={onMetricsChange}
            onFileChange={onFileChange}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
