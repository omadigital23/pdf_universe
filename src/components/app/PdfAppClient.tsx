"use client";

import { Suspense } from "react";
import { useTranslations } from "next-intl";
import { AppErrorBoundary } from "@/components/app/AppErrorBoundary";
import { AppRightRail } from "@/components/app/AppRightRail";
import { DiagnosticsPanel } from "@/components/app/DiagnosticsPanel";
import { MobileToolNav } from "@/components/app/MobileToolNav";
import { ToolPanel } from "@/components/app/ToolPanel";
import { ToolSidebar } from "@/components/app/ToolSidebar";
import { getToolNavItem, TOOL_NAV_ITEMS } from "@/components/app/tool-ui";
import { useStudioSession } from "@/components/app/hooks/useStudioSession";
import { useToolRouting } from "@/components/app/hooks/useToolRouting";
import { PdfPreview } from "@/components/shared/PdfPreview";
import type { ToolId } from "@/lib/types";

type Props = { locale: string };

function AppInner({ locale }: Props) {
  const t = useTranslations("app");
  const { activeTool, selectTool: navigateToTool } = useToolRouting({ locale });
  const session = useStudioSession({
    activeTool,
    readyText: t("statusReady"),
  });
  const activeMeta = getToolNavItem(activeTool);

  function selectTool(toolId: ToolId) {
    navigateToTool(toolId, session.resetSessionState);
  }

  return (
    <div className="mx-auto max-w-[1400px] overflow-x-hidden px-4 py-6 pb-24 sm:px-6 sm:py-8 lg:pb-8">
      <div className="flex gap-5">
        <ToolSidebar
          tools={TOOL_NAV_ITEMS}
          activeTool={activeTool}
          onSelect={selectTool}
        />

        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <MobileToolNav
            tools={TOOL_NAV_ITEMS}
            activeTool={activeTool}
            onSelect={selectTool}
          />

          <ToolPanel
            activeTool={activeTool}
            activeMeta={activeMeta}
            resetKey={session.resetKey}
            status={session.status}
            isWorking={session.isWorking}
            setStatus={session.handleStatusChange}
            onMetricsChange={session.updateMetrics}
            onFileChange={session.setPreviewFile}
          />

          <div className="xl:hidden">
            <PdfPreview file={session.previewFile} />
          </div>

          <div className="xl:hidden">
            <DiagnosticsPanel locale={locale} />
          </div>
        </div>

        <AppRightRail
          locale={locale}
          previewFile={session.previewFile}
          pdfCount={session.pdfCount}
          imgCount={session.imgCount}
          onReset={session.resetSession}
        />
      </div>
    </div>
  );
}

export function PdfAppClient({ locale }: Props) {
  const t = useTranslations("app");

  return (
    <AppErrorBoundary>
      <Suspense
        fallback={
          <div className="flex h-64 items-center justify-center text-sm text-[var(--muted)]">
            {t("loading")}
          </div>
        }
      >
        <AppInner locale={locale} />
      </Suspense>
    </AppErrorBoundary>
  );
}
