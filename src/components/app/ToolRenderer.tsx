"use client";

import dynamic from "next/dynamic";
import type { StudioMetricsPatch, StudioStatus, ToolId } from "@/lib/types";

type Props = {
  activeTool: ToolId;
  setStatus: (status: StudioStatus) => void;
  isWorking: boolean;
  onMetricsChange: (metrics: StudioMetricsPatch) => void;
  onFileChange: (file: File | null) => void;
};

const MergeTool = dynamic(
  () => import("@/components/tools/MergeTool").then((mod) => mod.MergeTool),
  { loading: ToolLoading, ssr: false },
);

const OrganizeTool = dynamic(
  () =>
    import("@/components/tools/OrganizeTool").then((mod) => mod.OrganizeTool),
  { loading: ToolLoading, ssr: false },
);

const ImagesToPdfTool = dynamic(
  () =>
    import("@/components/tools/ImagesToPdfTool").then(
      (mod) => mod.ImagesToPdfTool,
    ),
  { loading: ToolLoading, ssr: false },
);

const PdfToImagesTool = dynamic(
  () =>
    import("@/components/tools/PdfToImagesTool").then(
      (mod) => mod.PdfToImagesTool,
    ),
  { loading: ToolLoading, ssr: false },
);

const SignTool = dynamic(
  () => import("@/components/tools/SignTool").then((mod) => mod.SignTool),
  { loading: ToolLoading, ssr: false },
);

const EditTool = dynamic(
  () => import("@/components/tools/EditTool").then((mod) => mod.EditTool),
  { loading: ToolLoading, ssr: false },
);

export function ToolRenderer({
  activeTool,
  setStatus,
  isWorking,
  onMetricsChange,
  onFileChange,
}: Props) {
  const runtimeProps = { setStatus, isWorking, onMetricsChange };

  if (activeTool === "merge") {
    return <MergeTool {...runtimeProps} />;
  }

  if (activeTool === "organize") {
    return <OrganizeTool {...runtimeProps} onFileChange={onFileChange} />;
  }

  if (activeTool === "images-to-pdf") {
    return <ImagesToPdfTool {...runtimeProps} />;
  }

  if (activeTool === "pdf-to-images") {
    return <PdfToImagesTool {...runtimeProps} onFileChange={onFileChange} />;
  }

  if (activeTool === "sign") {
    return <SignTool {...runtimeProps} onFileChange={onFileChange} />;
  }

  return <EditTool {...runtimeProps} onFileChange={onFileChange} />;
}

function ToolLoading() {
  return (
    <div className="grid gap-4" aria-hidden="true">
      <div className="h-40 animate-pulse rounded-md border border-[var(--line)] bg-[var(--panel-secondary)]" />
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="h-11 animate-pulse rounded-md bg-[var(--panel-secondary)]" />
        <div className="h-11 animate-pulse rounded-md bg-[var(--panel-secondary)]" />
        <div className="h-11 animate-pulse rounded-md bg-[var(--panel-secondary)]" />
      </div>
    </div>
  );
}
