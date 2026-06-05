"use client";

import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { recordTelemetryEvent } from "@/lib/local-telemetry";
import type {
  StudioMetrics,
  StudioMetricsPatch,
  StudioStatus,
  ToolId,
} from "@/lib/types";

type UseStudioSessionArgs = {
  activeTool: ToolId;
  readyText: string;
};

export function useStudioSession({
  activeTool,
  readyText,
}: UseStudioSessionArgs) {
  const [status, setStatus] = useState<StudioStatus>({
    kind: "idle",
    text: readyText,
  });
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [metrics, setMetrics] = useState<StudioMetrics>({
    pdfCount: 0,
    imageCount: 0,
  });
  const [resetKey, setResetKey] = useState(0);
  const metricsRef = useRef(metrics);
  const lastStatusKindRef = useRef<StudioStatus["kind"]>("idle");
  const didRecordOpenRef = useRef(false);

  useEffect(() => {
    if (didRecordOpenRef.current) return;
    didRecordOpenRef.current = true;
    recordTelemetryEvent({ name: "app_open", tool: activeTool });
  }, [activeTool]);

  function handleStatusChange(nextStatus: StudioStatus) {
    const previousKind = lastStatusKindRef.current;
    const currentMetrics = metricsRef.current;

    if (nextStatus.kind === "working" && previousKind !== "working") {
      recordTelemetryEvent({
        name: "process_start",
        tool: activeTool,
        statusKind: nextStatus.kind,
        ...currentMetrics,
      });
    }

    if (nextStatus.kind === "success") {
      recordTelemetryEvent({
        name: "process_success",
        tool: activeTool,
        statusKind: nextStatus.kind,
        ...currentMetrics,
      });
    }

    if (nextStatus.kind === "error") {
      recordTelemetryEvent({
        name: "process_error",
        tool: activeTool,
        statusKind: nextStatus.kind,
        error: nextStatus.text.slice(0, 160),
        ...currentMetrics,
      });
    }

    lastStatusKindRef.current = nextStatus.kind;
    if (nextStatus.kind === "success" || nextStatus.kind === "error") {
      flushSync(() => setStatus(nextStatus));
      return;
    }

    setStatus(nextStatus);
  }

  function updateMetrics(patch: StudioMetricsPatch) {
    const previous = metricsRef.current;
    const next = {
      pdfCount: patch.pdfCount ?? previous.pdfCount,
      imageCount: patch.imageCount ?? previous.imageCount,
    };
    const previousTotal = previous.pdfCount + previous.imageCount;
    const nextTotal = next.pdfCount + next.imageCount;

    metricsRef.current = next;
    setMetrics(next);

    if (nextTotal > previousTotal) {
      recordTelemetryEvent({
        name: "files_selected",
        tool: activeTool,
        ...next,
      });
    }

    if (nextTotal < previousTotal) {
      recordTelemetryEvent({
        name: "files_removed",
        tool: activeTool,
        ...next,
      });
    }
  }

  function resetSessionState() {
    const emptyMetrics = { pdfCount: 0, imageCount: 0 };
    metricsRef.current = emptyMetrics;
    setPreviewFile(null);
    setMetrics(emptyMetrics);
    setResetKey((key) => key + 1);
    lastStatusKindRef.current = "idle";
    setStatus({ kind: "idle", text: readyText });
  }

  function resetSession() {
    resetSessionState();
    recordTelemetryEvent({ name: "session_reset", tool: activeTool });
  }

  return {
    status,
    previewFile,
    pdfCount: metrics.pdfCount,
    imgCount: metrics.imageCount,
    resetKey,
    isWorking: status.kind === "working",
    setPreviewFile,
    handleStatusChange,
    updateMetrics,
    resetSession,
    resetSessionState,
  };
}
