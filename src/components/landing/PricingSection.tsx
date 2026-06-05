import { CheckCircle2 } from "lucide-react";
import { Link } from "@/i18n/navigation";

type Props = {
  title: string;
  subtitle: string;
  freePlan: PlanCardProps;
  proPlan: PlanCardProps;
};

type PlanCardProps = {
  title: string;
  price: string;
  period: string;
  features: string[];
  action: string;
  badge?: string;
  featured?: boolean;
};

export function PricingSection({ title, subtitle, freePlan, proPlan }: Props) {
  return (
    <section className="border-y border-[var(--line)] bg-[var(--panel)] py-16 sm:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <h2 className="text-3xl font-black tracking-normal text-[var(--foreground)] sm:text-4xl">
            {title}
          </h2>
          <p className="mt-3 text-base leading-7 text-[var(--muted)]">
            {subtitle}
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <PlanCard {...freePlan} featured />
          <PlanCard {...proPlan} />
        </div>
      </div>
    </section>
  );
}

function PlanCard({
  title,
  price,
  period,
  features,
  action,
  badge,
  featured,
}: PlanCardProps) {
  return (
    <article
      className={`relative rounded-md border bg-[var(--background)] p-6 ${
        featured
          ? "border-[var(--accent)] shadow-[var(--shadow-md)]"
          : "border-[var(--line)] opacity-85"
      }`}
    >
      {badge ? (
        <span className="absolute right-4 top-4 rounded-full bg-[var(--dark-muted)] px-3 py-1 text-xs font-bold text-[var(--panel)]">
          {badge}
        </span>
      ) : null}
      <p className="text-sm font-black uppercase tracking-[0.12em] text-[var(--accent)]">
        {title}
      </p>
      <div className="mt-3 flex items-end gap-2">
        <span className="text-4xl font-black text-[var(--foreground)]">
          {price}
        </span>
        <span className="pb-1 text-sm font-medium text-[var(--muted)]">
          {period}
        </span>
      </div>
      <ul className="mt-6 space-y-3">
        {features.map((feature) => (
          <li
            key={feature}
            className="flex items-center gap-2 text-sm font-medium text-[var(--foreground)]"
          >
            <CheckCircle2
              className="h-4 w-4 shrink-0 text-[var(--accent)]"
              aria-hidden="true"
            />
            {feature}
          </li>
        ))}
      </ul>
      {featured ? (
        <Link
          href="/app"
          className="mt-6 flex h-11 w-full items-center justify-center rounded-md border border-[var(--accent)] bg-[var(--accent)] text-sm font-bold text-[var(--panel)] shadow-[var(--shadow-sm)] transition duration-200 hover:-translate-y-0.5 hover:bg-[var(--accent-strong)] focus-visible:outline-2"
        >
          {action}
        </Link>
      ) : (
        <button
          type="button"
          disabled
          className="mt-6 flex h-11 w-full cursor-not-allowed items-center justify-center rounded-md border border-[var(--line)] bg-[var(--panel)] text-sm font-bold text-[var(--muted)]"
        >
          {action}
        </button>
      )}
    </article>
  );
}
