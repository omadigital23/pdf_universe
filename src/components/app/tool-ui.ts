import {
  FileStack,
  ImagePlus,
  Images,
  PenLine,
  Scissors,
  Type,
  type LucideIcon,
} from "lucide-react";
import { DEFAULT_TOOL_ID, TOOL_IDS, TOOL_TRANSLATION_KEYS } from "@/lib/tools";
import type { ToolId } from "@/lib/types";

type ToolVisualConfig = {
  icon: LucideIcon;
  colorVar: string;
  bgVar: string;
};

const TOOL_VISUALS = {
  merge: {
    icon: FileStack,
    colorVar: "var(--tool-merge-accent)",
    bgVar: "var(--tool-merge-bg)",
  },
  organize: {
    icon: Scissors,
    colorVar: "var(--tool-organize-accent)",
    bgVar: "var(--tool-organize-bg)",
  },
  "images-to-pdf": {
    icon: ImagePlus,
    colorVar: "var(--tool-images-accent)",
    bgVar: "var(--tool-images-bg)",
  },
  "pdf-to-images": {
    icon: Images,
    colorVar: "var(--tool-pdf-images-accent)",
    bgVar: "var(--tool-pdf-images-bg)",
  },
  sign: {
    icon: PenLine,
    colorVar: "var(--tool-sign-accent)",
    bgVar: "var(--tool-sign-bg)",
  },
  edit: {
    icon: Type,
    colorVar: "var(--tool-edit-accent)",
    bgVar: "var(--tool-edit-bg)",
  },
} as const satisfies Record<ToolId, ToolVisualConfig>;

export type ToolNavItem = {
  id: ToolId;
  icon: LucideIcon;
  labelKey: string;
  shortKey: string;
  colorVar: string;
  bgVar: string;
};

export const TOOL_NAV_ITEMS = TOOL_IDS.map((id) => ({
  id,
  icon: TOOL_VISUALS[id].icon,
  labelKey: TOOL_TRANSLATION_KEYS[id].label,
  shortKey: TOOL_TRANSLATION_KEYS[id].short,
  colorVar: TOOL_VISUALS[id].colorVar,
  bgVar: TOOL_VISUALS[id].bgVar,
})) satisfies ToolNavItem[];

export function getToolNavItem(id: ToolId): ToolNavItem {
  const selectedTool = TOOL_NAV_ITEMS.find((tool) => tool.id === id);
  if (selectedTool) return selectedTool;

  const fallbackTool = TOOL_NAV_ITEMS.find((tool) => tool.id === DEFAULT_TOOL_ID);
  if (!fallbackTool) {
    throw new Error("Default PDF tool configuration is missing.");
  }

  return fallbackTool;
}
