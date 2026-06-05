import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { ProductPreview } from "@/components/landing/ProductPreview";
import type {
  LandingStat,
  LandingToolCard,
} from "@/components/landing/types";

type Props = {
  heroTag: string;
  heroTitle: string;
  heroSubtitle: string;
  heroCta: string;
  heroSecondaryCta: string;
  proofItems: string[];
  stats: LandingStat[];
  preview: {
    title: string;
    status: string;
    drop: string;
    action: string;
    privacy: string;
  };
  tools: LandingToolCard[];
};

export function HeroSection({
  heroTag,
  heroTitle,
  heroSubtitle,
  heroCta,
  heroSecondaryCta,
  proofItems,
  stats,
  preview,
  tools,
}: Props) {
  return (
    <section className="relative overflow-hidden border-b border-[var(--line)]">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[minmax(0,1fr)_500px] lg:items-center lg:px-8 lg:py-24">
        <div className="max-w-3xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--accent-light)] bg-[var(--accent-muted)] px-4 py-1.5 text-xs font-bold uppercase tracking-[0.08em] text-[var(--accent)]">
            <span
              className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]"
              aria-hidden="true"
            />
            {heroTag}
          </div>
          <h1 className="max-w-[21rem] break-words text-4xl font-black leading-[1.02] tracking-normal text-[var(--foreground)] sm:max-w-3xl sm:text-6xl lg:text-7xl">
            {heroTitle}
          </h1>
          <p className="mt-5 max-w-[22rem] text-base leading-8 text-[var(--muted)] sm:max-w-2xl sm:text-xl">
            {heroSubtitle}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/app"
              className="inline-flex h-12 w-full max-w-[22rem] items-center justify-center gap-2 rounded-md border border-[var(--accent)] bg-[var(--accent)] px-6 text-base font-bold text-[var(--panel)] shadow-[var(--shadow-accent)] transition duration-200 hover:-translate-y-0.5 hover:bg-[var(--accent-strong)] focus-visible:outline-2 sm:w-auto"
            >
              {heroCta}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <a
              href="#features"
              className="inline-flex h-12 w-full max-w-[22rem] items-center justify-center gap-2 rounded-md border border-[var(--line)] bg-[var(--panel)] px-5 text-base font-bold text-[var(--foreground)] shadow-[var(--shadow-xs)] transition duration-200 hover:-translate-y-0.5 hover:border-[var(--accent)] hover:text-[var(--accent)] focus-visible:outline-2 sm:w-auto"
            >
              {heroSecondaryCta}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {proofItems.map((item) => (
              <span
                key={item}
                className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--panel)] px-3 py-1.5 text-sm font-semibold text-[var(--muted)]"
              >
                <CheckCircle2
                  className="h-4 w-4 text-[var(--accent)]"
                  aria-hidden="true"
                />
                {item}
              </span>
            ))}
          </div>
        </div>

        <ProductPreview
          title={preview.title}
          status={preview.status}
          drop={preview.drop}
          action={preview.action}
          privacy={preview.privacy}
          tools={tools}
        />
      </div>

      <div className="mx-auto grid max-w-7xl gap-3 px-4 pb-12 sm:grid-cols-3 sm:px-6 lg:px-8">
        {stats.map((stat) => (
          <div
            key={stat.value}
            className="rounded-md border border-[var(--line)] bg-[var(--panel)] p-4"
          >
            <p className="text-2xl font-black text-[var(--accent)]">
              {stat.value}
            </p>
            <p className="mt-1 text-sm font-medium text-[var(--muted)]">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
