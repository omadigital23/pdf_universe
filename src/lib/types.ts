/**
 * types.ts
 * Types partagés entre tous les composants de l'application.
 */

export type ToolId = "merge" | "images-to-pdf" | "pdf-to-images" | "sign" | "edit";
export type StatusKind = "idle" | "working" | "success" | "error";
export type PageMode = "a4-portrait" | "a4-landscape" | "original";
export type Placement = "bottom-right" | "bottom-left" | "center" | "top-right";
export type EditTarget = "all" | "single";

export type StudioStatus = {
  kind: StatusKind;
  text: string;
};
