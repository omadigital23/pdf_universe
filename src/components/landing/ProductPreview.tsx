import { UploadCloud } from "lucide-react";
import type { LandingToolCard } from "@/components/landing/types";

type Props = {
  title: string;
  status: string;
  drop: string;
  action: string;
  privacy: string;
  tools: LandingToolCard[];
};

export function ProductPreview({
  title,
  status,
  drop,
  action,
  privacy,
  tools,
}: Props) {
  return (
    <div className="relative mx-auto w-full max-w-[calc(100vw-2rem)] overflow-hidden rounded-md border border-[var(--line)] bg-[var(--panel)] p-3 shadow-[var(--shadow-xl)] sm:max-w-[500px]">
      <div className="rounded-md border border-[var(--line)] bg-[var(--panel-secondary)]">
        <div className="flex items-center justify-between gap-3 border-b border-[var(--line)] px-4 py-3">
          <div>
            <p className="text-sm font-black text-[var(--foreground)]">{title}</p>
            <p className="text-xs font-medium text-[var(--muted)]">{status}</p>
          </div>
          <span className="hidden rounded-full bg-[var(--accent-muted)] px-3 py-1 text-xs font-bold text-[var(--accent)] sm:inline-flex">
            {action}
          </span>
        </div>
        <div className="grid gap-3 p-4">
          <div className="flex min-h-32 items-center justify-center rounded-md border border-dashed border-[var(--accent-light)] bg-[var(--panel)] px-6 text-center">
            <div>
              <UploadCloud
                className="mx-auto mb-3 h-8 w-8 text-[var(--accent)]"
                aria-hidden="true"
              />
              <p className="text-sm font-black text-[var(--foreground)]">
                {drop}
              </p>
              <p className="mt-1 text-xs font-medium text-[var(--muted)]">
                {privacy}
              </p>
            </div>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {tools.slice(0, 4).map((tool) => {
              const Icon = tool.icon;
              return (
                <div
                  key={tool.label}
                  className="flex items-center gap-2 rounded-md border border-[var(--line)] bg-[var(--panel)] px-3 py-2"
                >
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md border ${tool.tone}`}
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span className="truncate text-xs font-bold text-[var(--foreground)]">
                    {tool.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
