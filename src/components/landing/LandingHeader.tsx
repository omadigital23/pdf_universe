import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { OmaLogo } from "@/components/shared/OmaLogo";

type Props = {
  agencyLabel: string;
  brand: string;
  tagline: string;
  primaryNavigation: string;
  localeSwitch: string;
  altLocale: "fr" | "en";
  appLabel: string;
};

export function LandingHeader({
  agencyLabel,
  brand,
  tagline,
  primaryNavigation,
  localeSwitch,
  altLocale,
  appLabel,
}: Props) {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[var(--panel-glass)] backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <a
          href="https://omadigital.net"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2.5 rounded-md focus-visible:outline-2"
          aria-label={agencyLabel}
        >
          <OmaLogo size={34} />
          <span className="leading-tight">
            <span className="block text-sm font-bold text-[var(--foreground)]">
              {brand}
            </span>
            <span className="block text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
              {tagline}
            </span>
          </span>
        </a>

        <nav className="flex items-center gap-2" aria-label={primaryNavigation}>
          <Link
            href="/"
            locale={altLocale}
            className="rounded-md border border-[var(--line)] bg-[var(--panel)] px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-[var(--muted)] transition hover:border-[var(--accent)] hover:text-[var(--accent)] focus-visible:outline-2"
          >
            {localeSwitch}
          </Link>
          <Link
            href="/app"
            aria-label={appLabel}
            className="hidden h-10 items-center justify-center gap-2 rounded-md border border-[var(--accent)] bg-[var(--accent)] text-sm font-bold text-[var(--panel)] shadow-[var(--shadow-sm)] transition duration-200 hover:-translate-y-0.5 hover:bg-[var(--accent-strong)] focus-visible:outline-2 sm:inline-flex sm:px-4"
          >
            <span className="hidden sm:inline">{appLabel}</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </nav>
      </div>
    </header>
  );
}
