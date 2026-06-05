"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { DEFAULT_TOOL_ID, isToolId } from "@/lib/tools";
import { recordTelemetryEvent } from "@/lib/local-telemetry";
import type { ToolId } from "@/lib/types";

type UseToolRoutingArgs = {
  locale: string;
};

export function useToolRouting({ locale }: UseToolRoutingArgs) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const toolParam = searchParams.get("tool");
  const activeTool = isToolId(toolParam) ? toolParam : DEFAULT_TOOL_ID;

  function selectTool(nextTool: ToolId, onBeforeChange?: () => void) {
    if (nextTool === activeTool) return;

    onBeforeChange?.();
    recordTelemetryEvent({ name: "tool_select", tool: nextTool });
    router.push(`/${locale}/app?tool=${nextTool}`, { scroll: false });
  }

  return { activeTool, selectTool };
}
