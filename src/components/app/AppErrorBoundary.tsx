"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";
import { useTranslations } from "next-intl";
import { recordTelemetryEvent } from "@/lib/local-telemetry";

type Labels = {
  title: string;
  description: string;
  reset: string;
};

type Props = {
  children: ReactNode;
  labels: Labels;
};

type State = {
  hasError: boolean;
};

class PdfErrorBoundary extends Component<Props, State> {
  override state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    recordTelemetryEvent({
      name: "runtime_error",
      error: `${error.name}: ${error.message}`.slice(0, 160),
      statusKind: "error",
    });

    if (process.env.NODE_ENV !== "production") {
      console.error(error, errorInfo);
    }
  }

  override render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="mx-auto grid min-h-[50vh] max-w-xl place-items-center px-4 py-16">
        <div className="rounded-md border border-[var(--danger-line)] bg-[var(--danger-bg)] p-6 text-center shadow-[var(--shadow-sm)]">
          <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-md bg-[var(--panel)] text-[var(--danger)]">
            <AlertTriangle className="h-5 w-5" aria-hidden="true" />
          </div>
          <h2 className="text-lg font-black text-[var(--foreground)]">
            {this.props.labels.title}
          </h2>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            {this.props.labels.description}
          </p>
          <button
            type="button"
            onClick={() => this.setState({ hasError: false })}
            className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-md border border-[var(--foreground)] bg-[var(--foreground)] px-4 text-sm font-bold text-[var(--panel)] transition hover:bg-[var(--foreground-soft)] focus-visible:outline-2"
          >
            <RefreshCcw className="h-4 w-4" aria-hidden="true" />
            {this.props.labels.reset}
          </button>
        </div>
      </div>
    );
  }
}

export function AppErrorBoundary({ children }: { children: ReactNode }) {
  const t = useTranslations("app.errors");

  return (
    <PdfErrorBoundary
      labels={{
        title: t("title"),
        description: t("description"),
        reset: t("reset"),
      }}
    >
      {children}
    </PdfErrorBoundary>
  );
}
