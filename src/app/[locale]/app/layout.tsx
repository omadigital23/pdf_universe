import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { FileText, Home } from "lucide-react";
import { OmaLogo } from "@/components/shared/OmaLogo";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function AppLayout({ children, params }: Props) {
  const { locale } = await params;
  const tn = await getTranslations({ locale, namespace: "nav" });

  return (
    <div className="flex min-h-screen flex-col bg-[var(--background)] text-[var(--foreground)]">
      <header className="sticky top-0 z-40 h-14 border-b border-[var(--line)] bg-[var(--panel-glass)] backdrop-blur-md">
        <div className="mx-auto flex h-full max-w-[1400px] items-center justify-between gap-4 px-4 sm:px-6">
          <a
            href="https://omadigital.net"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-md focus-visible:outline-2"
            aria-label={tn("agencyLink")}
          >
            <OmaLogo size={28} />
            <span className="hidden text-sm font-bold text-[var(--foreground)] sm:block">
              {tn("brand")}
            </span>
          </a>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="inline-flex h-9 items-center gap-1.5 rounded-md border border-transparent px-3 text-sm font-semibold text-[var(--muted)] transition hover:border-[var(--line)] hover:bg-[var(--panel)] hover:text-[var(--foreground)] focus-visible:outline-2"
              aria-label={tn("home")}
            >
              <Home className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">{tn("home")}</span>
            </Link>
            <div className="inline-flex h-9 items-center gap-2 rounded-md border border-[var(--accent-light)] bg-[var(--accent-muted)] px-3 text-xs font-bold uppercase tracking-[0.08em] text-[var(--accent)]">
              <FileText className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">{tn("brand")}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto">{children}</main>

      <footer className="hidden border-t border-[var(--line)] bg-[var(--panel)] px-4 py-3 text-center text-xs font-medium text-[var(--muted)] lg:block">
        {tn("brand")}
      </footer>
    </div>
  );
}
