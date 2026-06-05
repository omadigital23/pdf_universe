import { OmaLogo } from "@/components/shared/OmaLogo";

type Props = {
  agency: string;
  privacy: string;
  copyright: string;
  contact: string;
};

export function LandingFooter({
  agency,
  privacy,
  copyright,
  contact,
}: Props) {
  return (
    <footer className="border-t border-[var(--line)] bg-[var(--panel)] py-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 text-center sm:flex-row sm:px-6 sm:text-left lg:px-8">
        <div className="flex items-center gap-2">
          <OmaLogo size={26} />
          <span className="text-sm font-bold text-[var(--foreground)]">
            {agency}
          </span>
        </div>
        <div className="flex flex-col items-center gap-1 sm:items-end">
          <p className="text-xs text-[var(--muted)]">{privacy}</p>
          <p className="text-xs text-[var(--muted)]">
            {copyright}{" "}
            <a
              href="mailto:omadigital23@gmail.com"
              className="font-semibold text-[var(--accent)] hover:underline"
            >
              {contact}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
