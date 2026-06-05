"use client";

import type { KeyboardEvent } from "react";
import { ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { OmaLogo } from "@/components/shared/OmaLogo";
import type { ToolNavItem } from "@/components/app/tool-ui";
import type { ToolId } from "@/lib/types";

type Props = {
  tools: ToolNavItem[];
  activeTool: ToolId;
  onSelect: (toolId: ToolId) => void;
};

export function ToolSidebar({ tools, activeTool, onSelect }: Props) {
  const t = useTranslations("app");

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    const currentIndex = tools.findIndex((tool) => tool.id === activeTool);
    if (currentIndex < 0) return;

    const lastIndex = tools.length - 1;
    const nextIndex =
      event.key === "ArrowDown"
        ? Math.min(currentIndex + 1, lastIndex)
        : event.key === "ArrowUp"
          ? Math.max(currentIndex - 1, 0)
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? lastIndex
              : currentIndex;

    if (nextIndex === currentIndex) return;
    const nextTool = tools[nextIndex];
    if (!nextTool) return;
    event.preventDefault();
    onSelect(nextTool.id);
  }

  return (
    <aside
      className="hidden w-52 shrink-0 flex-col gap-1.5 lg:flex"
      aria-label={t("toolsNavigation")}
    >
      <div className="mb-3 flex items-center gap-2 border-b border-[var(--line)] px-3 pb-3">
        <OmaLogo size={24} />
        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
          {t("toolsHeading")}
        </span>
      </div>

      {tools.map((tool) => {
        const Icon = tool.icon;
        const isActive = tool.id === activeTool;

        return (
          <button
            key={tool.id}
            type="button"
            onClick={() => onSelect(tool.id)}
            onKeyDown={handleKeyDown}
            aria-current={isActive ? "page" : undefined}
            aria-pressed={isActive}
            className={`group flex items-center gap-3 rounded-md border px-3 py-2.5 text-left transition duration-200 ${
              isActive
                ? "border-[var(--line)] text-[var(--foreground)]"
                : "border-transparent text-[var(--muted)] hover:border-[var(--line)] hover:bg-[var(--panel-secondary)] hover:text-[var(--foreground)]"
            }`}
            style={
              isActive
                ? { background: tool.bgVar, boxShadow: "var(--shadow-xs)" }
                : undefined
            }
          >
            <span
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md transition-colors"
              style={
                isActive
                  ? { background: tool.colorVar }
                  : { background: "var(--panel-secondary)" }
              }
            >
              <Icon
                className="h-4 w-4"
                style={{ color: isActive ? "var(--panel)" : "var(--muted)" }}
                aria-hidden="true"
              />
            </span>

            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium">
                {t(tool.labelKey)}
              </span>
              <span className="block truncate text-xs text-[var(--muted-light)]">
                {t(tool.shortKey)}
              </span>
            </span>

            {isActive ? (
              <ChevronRight
                className="h-3.5 w-3.5 shrink-0"
                style={{ color: tool.colorVar }}
                aria-hidden="true"
              />
            ) : null}
          </button>
        );
      })}
    </aside>
  );
}
