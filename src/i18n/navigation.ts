import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

// Navigation next-intl : Link et redirect qui préfixent automatiquement la locale
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
