"use client";

import type { KeyboardEvent } from "react";
import { useTranslations } from "next-intl";
import type { ToolNavItem } from "@/components/app/tool-ui";
import type { ToolId } from "@/lib/types";

type Props = {
  tools: ToolNavItem[];
  activeTool: ToolId;
  onSelect: (toolId: ToolId) => void;
};

export function MobileToolNav({ tools, activeTool, onSelect }: Props) {
  const t = useTranslations("app");

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    const currentIndex = tools.findIndex((tool) => tool.id === activeTool);
    if (currentIndex < 0) return;

    const lastIndex = tools.length - 1;
    const nextIndex =
      event.key === "ArrowRight" || event.key === "ArrowDown"
        ? Math.min(currentIndex + 1, lastIndex)
        : event.key === "ArrowLeft" || event.key === "ArrowUp"
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
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 flex gap-1 overflow-hidden border-t border-[var(--line)] bg-[var(--panel-glass)] px-2 py-2 backdrop-blur-md lg:hidden"
      aria-label={t("toolsNavigation")}
    >
      {tools.map((tool) => {
        const Icon = tool.icon;
        const isActive = tool.id === activeTool;

        return (
          <button
            key={tool.id}
            type="button"
            onClick={() => onSelect(tool.id)}
            onKeyDown={handleKeyDown}
            aria-label={t(tool.labelKey)}
            aria-current={isActive ? "page" : undefined}
            aria-pressed={isActive}
            className={`flex min-h-14 items-center justify-center gap-1.5 overflow-hidden rounded-md border py-1.5 font-bold transition duration-200 ${
              isActive
                ? "min-w-[6.75rem] flex-1 border-transparent px-3 text-xs text-[var(--panel)] shadow-[var(--shadow-xs)]"
                : "w-12 flex-none border-[var(--line)] bg-[var(--panel-secondary)] px-1.5 text-[var(--muted)]"
            }`}
            style={isActive ? { background: tool.colorVar } : undefined}
          >
            <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span className={isActive ? "max-w-full truncate" : "sr-only"}>
              {t(tool.labelKey)}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
