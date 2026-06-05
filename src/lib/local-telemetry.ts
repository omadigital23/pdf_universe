import type { StatusKind, ToolId } from "./types";
import { TOOL_IDS } from "./tools";

const STORAGE_KEY = "oma-pdf-telemetry-v1";
const MAX_EVENTS = 200;

export type TelemetryEventName =
  | "app_open"
  | "diagnostics_clear"
  | "diagnostics_export"
  | "files_removed"
  | "files_selected"
  | "process_error"
  | "process_start"
  | "process_success"
  | "runtime_error"
  | "session_reset"
  | "tool_select";

export type TelemetryEvent = {
  id: string;
  at: string;
  name: TelemetryEventName;
  tool?: ToolId;
  pdfCount?: number;
  imageCount?: number;
  statusKind?: StatusKind;
  durationMs?: number;
  error?: string;
};

export type TelemetrySnapshot = {
  version: 1;
  createdAt: string;
  updatedAt: string;
  events: TelemetryEvent[];
};

export type DiagnosticsReport = {
  generatedAt: string;
  app: {
    name: "OMA PDF";
    version: string;
    locale: string;
  };
  runtime: {
    userAgent: string;
    viewport: string;
    timezone: string;
  };
  summary: {
    events: number;
    errors: number;
    successes: number;
    toolSelections: Record<ToolId, number>;
  };
  events: TelemetryEvent[];
};

function canUseStorage(): boolean {
  try {
    return (
      typeof window !== "undefined" && typeof window.localStorage !== "undefined"
    );
  } catch {
    return false;
  }
}

function createId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function createSnapshot(): TelemetrySnapshot {
  const now = new Date().toISOString();
  return {
    version: 1,
    createdAt: now,
    updatedAt: now,
    events: [],
  };
}

export function readTelemetrySnapshot(): TelemetrySnapshot {
  if (!canUseStorage()) return createSnapshot();

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return createSnapshot();
    const parsed = JSON.parse(raw) as TelemetrySnapshot;
    if (parsed.version !== 1 || !Array.isArray(parsed.events)) {
      return createSnapshot();
    }
    return parsed;
  } catch {
    return createSnapshot();
  }
}

function writeTelemetrySnapshot(snapshot: TelemetrySnapshot): void {
  if (!canUseStorage()) return;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
  } catch {
    // Telemetry is best-effort and must never break PDF tools.
  }
}

export function recordTelemetryEvent(
  event: Omit<TelemetryEvent, "at" | "id">,
): void {
  const snapshot = readTelemetrySnapshot();
  const nextEvent: TelemetryEvent = {
    ...event,
    id: createId(),
    at: new Date().toISOString(),
  };
  const events = [...snapshot.events, nextEvent].slice(-MAX_EVENTS);

  writeTelemetrySnapshot({
    ...snapshot,
    updatedAt: nextEvent.at,
    events,
  });
}

export function clearTelemetry(): void {
  const snapshot = createSnapshot();
  writeTelemetrySnapshot(snapshot);
  recordTelemetryEvent({ name: "diagnostics_clear" });
}

export function buildDiagnosticsReport(
  locale: string,
  appVersion: string,
): DiagnosticsReport {
  const snapshot = readTelemetrySnapshot();
  const toolSelections = Object.fromEntries(
    TOOL_IDS.map((toolId) => [
      toolId,
      snapshot.events.filter(
        (event) => event.name === "tool_select" && event.tool === toolId,
      ).length,
    ]),
  ) as Record<ToolId, number>;

  return {
    generatedAt: new Date().toISOString(),
    app: {
      name: "OMA PDF",
      version: appVersion,
      locale,
    },
    runtime: {
      userAgent: typeof navigator === "undefined" ? "unknown" : navigator.userAgent,
      viewport:
        typeof window === "undefined"
          ? "unknown"
          : `${window.innerWidth}x${window.innerHeight}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
    summary: {
      events: snapshot.events.length,
      errors: snapshot.events.filter((event) =>
        event.name === "process_error" || event.name === "runtime_error",
      ).length,
      successes: snapshot.events.filter((event) => event.name === "process_success")
        .length,
      toolSelections,
    },
    events: snapshot.events,
  };
}
