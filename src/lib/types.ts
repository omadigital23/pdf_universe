export type ToolId =
  | "merge"
  | "organize"
  | "images-to-pdf"
  | "pdf-to-images"
  | "sign"
  | "edit";
export type StatusKind = "idle" | "working" | "success" | "error";
export type PageMode = "a4-portrait" | "a4-landscape" | "original";
export type Placement = "bottom-right" | "bottom-left" | "center" | "top-right";
export type EditTarget = "all" | "single";

export type StudioStatus = {
  kind: StatusKind;
  text: string;
};

export type StudioMetrics = {
  pdfCount: number;
  imageCount: number;
};

export type StudioMetricsPatch = Partial<StudioMetrics>;

export type ToolRuntimeProps = {
  setStatus: (status: StudioStatus) => void;
  isWorking: boolean;
  onMetricsChange: (metrics: StudioMetricsPatch) => void;
};
