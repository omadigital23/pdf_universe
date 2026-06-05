import { FileText } from "lucide-react";
import { Link } from "@/i18n/navigation";

type Props = {
  title: string;
  subtitle: string;
  action: string;
};

export function CtaSection({ title, subtitle, action }: Props) {
  return (
    <section className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
      <h2 className="text-3xl font-black tracking-normal text-[var(--foreground)] sm:text-4xl">
        {title}
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-base leading-7 text-[var(--muted)]">
        {subtitle}
      </p>
      <Link
        href="/app"
        className="mt-8 inline-flex h-12 items-center gap-2 rounded-md border border-[var(--accent)] bg-[var(--accent)] px-7 text-base font-bold text-[var(--panel)] shadow-[var(--shadow-accent)] transition duration-200 hover:-translate-y-0.5 hover:bg-[var(--accent-strong)] focus-visible:outline-2"
      >
        <FileText className="h-4 w-4" aria-hidden="true" />
        {action}
      </Link>
    </section>
  );
}
