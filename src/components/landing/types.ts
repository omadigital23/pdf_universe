import type { LucideIcon } from "lucide-react";

export type LandingToolCard = {
  icon: LucideIcon;
  label: string;
  desc: string;
  tone: string;
};

export type LandingIconItem = {
  icon: LucideIcon;
  title: string;
  desc: string;
};

export type LandingStat = {
  value: string;
  label: string;
};
