import type { LandingIconItem } from "@/components/landing/types";

type Props = {
  title: string;
  subtitle: string;
  items: LandingIconItem[];
};

export function WhySection({ title, subtitle, items }: Props) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="mb-10 max-w-2xl">
        <h2 className="text-3xl font-black tracking-normal text-[var(--foreground)] sm:text-4xl">
          {title}
        </h2>
        <p className="mt-3 text-base leading-7 text-[var(--muted)]">
          {subtitle}
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <article
              key={item.title}
              className="rounded-md border border-[var(--line)] bg-[var(--panel)] p-5 shadow-[var(--shadow-xs)]"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-[var(--accent-muted)] text-[var(--accent)]">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="font-black text-[var(--foreground)]">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                {item.desc}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
