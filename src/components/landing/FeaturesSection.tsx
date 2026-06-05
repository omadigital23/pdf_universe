import type { LandingToolCard } from "@/components/landing/types";

type Props = {
  title: string;
  subtitle: string;
  tools: LandingToolCard[];
};

export function FeaturesSection({ title, subtitle, tools }: Props) {
  return (
    <section
      id="features"
      className="border-b border-[var(--line)] bg-[var(--panel)] py-16 sm:py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <h2 className="text-3xl font-black tracking-normal text-[var(--foreground)] sm:text-4xl">
            {title}
          </h2>
          <p className="mt-3 text-base leading-7 text-[var(--muted)]">
            {subtitle}
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {tools.map((tool) => {
            const Icon = tool.icon;

            return (
              <article
                key={tool.label}
                className="group rounded-md border border-[var(--line)] bg-[var(--background)] p-5 transition duration-200 hover:-translate-y-1 hover:border-[var(--accent)] hover:shadow-[var(--shadow-md)]"
              >
                <span
                  className={`mb-5 flex h-11 w-11 items-center justify-center rounded-md border ${tool.tone}`}
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="text-base font-black text-[var(--foreground)]">
                  {tool.label}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                  {tool.desc}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
