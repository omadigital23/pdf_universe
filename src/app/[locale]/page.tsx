import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  Edit3,
  FileImage,
  FileStack,
  FileText,
  Globe,
  ImageIcon,
  Layers2,
  Lock,
  PenLine,
  UploadCloud,
} from "lucide-react";
import { OmaLogo } from "@/components/shared/OmaLogo";

type Props = {
  params: Promise<{ locale: string }>;
};

type CardItem = {
  icon: typeof FileStack;
  label: string;
  desc: string;
  tone: string;
};

export default async function LandingPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "landing" });
  const tn = await getTranslations({ locale, namespace: "nav" });
  const tf = await getTranslations({ locale, namespace: "footer" });

  const tools: CardItem[] = [
    { icon: FileStack, tone: "bg-[var(--tool-merge-bg)] text-[var(--tool-merge-accent)] border-[var(--accent-light)]", label: t("featureMergeLabel"), desc: t("featureMergeDesc") },
    { icon: ImageIcon, tone: "bg-[var(--tool-images-bg)] text-[var(--tool-images-accent)] border-[var(--warning-line)]", label: t("featureImagesLabel"), desc: t("featureImagesDesc") },
    { icon: FileImage, tone: "bg-[var(--tool-pdf-images-bg)] text-[var(--tool-pdf-images-accent)] border-[var(--info-line)]", label: t("featurePdfImagesLabel"), desc: t("featurePdfImagesDesc") },
    { icon: PenLine, tone: "bg-[var(--tool-sign-bg)] text-[var(--tool-sign-accent)] border-[var(--danger-line)]", label: t("featureSignLabel"), desc: t("featureSignDesc") },
    { icon: Edit3, tone: "bg-[var(--tool-edit-bg)] text-[var(--tool-edit-accent)] border-[var(--line)]", label: t("featureEditLabel"), desc: t("featureEditDesc") },
  ];

  const whyItems = [
    { icon: Lock, title: t("why1Title"), desc: t("why1Desc") },
    { icon: BadgeCheck, title: t("why2Title"), desc: t("why2Desc") },
    { icon: Globe, title: t("why3Title"), desc: t("why3Desc") },
    { icon: Layers2, title: t("why4Title"), desc: t("why4Desc") },
  ];

  const freeFeatures = [
    t("planFreeFeature1"),
    t("planFreeFeature2"),
    t("planFreeFeature3"),
    t("planFreeFeature4"),
    t("planFreeFeature5"),
  ];

  const proFeatures = [
    t("planProFeature1"),
    t("planProFeature2"),
    t("planProFeature3"),
    t("planProFeature4"),
    t("planProFeature5"),
  ];

  const proofItems = [t("heroProof1"), t("heroProof2"), t("heroProof3")];
  const stats = [
    { value: t("statTools"), label: t("statToolsDesc") },
    { value: t("statLocal"), label: t("statLocalDesc") },
    { value: t("statPrice"), label: t("statPriceDesc") },
  ];
  const altLocale = tn("localeSwitchTarget") as "fr" | "en";

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-[var(--background)] text-[var(--foreground)]">
      <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[var(--panel-glass)] backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <a
            href="https://omadigital.net"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 rounded-md focus-visible:outline-2"
            aria-label={tn("agencyLink")}
          >
            <OmaLogo size={34} />
            <span className="leading-tight">
              <span className="block text-sm font-bold text-[var(--foreground)]">{tn("brand")}</span>
              <span className="block text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">{tn("tagline")}</span>
            </span>
          </a>

          <nav className="flex items-center gap-2" aria-label={tn("primaryNavigation")}>
            <Link
              href="/"
              locale={altLocale}
              className="rounded-md border border-[var(--line)] bg-[var(--panel)] px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-[var(--muted)] transition hover:border-[var(--accent)] hover:text-[var(--accent)] focus-visible:outline-2"
            >
              {tn("localeSwitch")}
            </Link>
            <Link
              href="/app"
              aria-label={tn("app")}
              className="hidden h-10 items-center justify-center gap-2 rounded-md border border-[var(--accent)] bg-[var(--accent)] text-sm font-bold text-[var(--panel)] shadow-[var(--shadow-sm)] transition duration-200 hover:-translate-y-0.5 hover:bg-[var(--accent-strong)] focus-visible:outline-2 sm:inline-flex sm:px-4"
            >
              <span className="hidden sm:inline">{tn("app")}</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: tn("brand"),
              applicationCategory: "BusinessApplication",
              operatingSystem: "Web",
              url: `https://pdfuniverse.omadigital.net/${locale}`,
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              publisher: {
                "@type": "Organization",
                name: "OMA Digital",
                url: "https://omadigital.net",
              },
            }),
          }}
        />

        <section className="relative overflow-hidden border-b border-[var(--line)]">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[minmax(0,1fr)_500px] lg:items-center lg:px-8 lg:py-24">
            <div className="max-w-3xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--accent-light)] bg-[var(--accent-muted)] px-4 py-1.5 text-xs font-bold uppercase tracking-[0.08em] text-[var(--accent)]">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" aria-hidden="true" />
                {t("heroTag")}
              </div>
              <h1 className="max-w-[21rem] break-words text-4xl font-black leading-[1.02] tracking-normal text-[var(--foreground)] sm:max-w-3xl sm:text-6xl lg:text-7xl">
                {t("heroTitle")}
              </h1>
              <p className="mt-5 max-w-[22rem] text-base leading-8 text-[var(--muted)] sm:max-w-2xl sm:text-xl">
                {t("heroSubtitle")}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/app"
                  className="inline-flex h-12 w-full max-w-[22rem] items-center justify-center gap-2 rounded-md border border-[var(--accent)] bg-[var(--accent)] px-6 text-base font-bold text-[var(--panel)] shadow-[var(--shadow-accent)] transition duration-200 hover:-translate-y-0.5 hover:bg-[var(--accent-strong)] focus-visible:outline-2 sm:w-auto"
                >
                  {t("heroCta")}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <a
                  href="#features"
                  className="inline-flex h-12 w-full max-w-[22rem] items-center justify-center gap-2 rounded-md border border-[var(--line)] bg-[var(--panel)] px-5 text-base font-bold text-[var(--foreground)] shadow-[var(--shadow-xs)] transition duration-200 hover:-translate-y-0.5 hover:border-[var(--accent)] hover:text-[var(--accent)] focus-visible:outline-2 sm:w-auto"
                >
                  {t("heroSecondaryCta")}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                {proofItems.map((item) => (
                  <span key={item} className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--panel)] px-3 py-1.5 text-sm font-semibold text-[var(--muted)]">
                    <CheckCircle2 className="h-4 w-4 text-[var(--accent)]" aria-hidden="true" />
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <ProductPreview
              title={t("previewTitle")}
              status={t("previewStatus")}
              drop={t("previewDrop")}
              action={t("previewAction")}
              privacy={t("previewPrivacy")}
              tools={tools}
            />
          </div>

          <div className="mx-auto grid max-w-7xl gap-3 px-4 pb-12 sm:grid-cols-3 sm:px-6 lg:px-8">
            {stats.map((stat) => (
              <div key={stat.value} className="rounded-md border border-[var(--line)] bg-[var(--panel)] p-4">
                <p className="text-2xl font-black text-[var(--accent)]">{stat.value}</p>
                <p className="mt-1 text-sm font-medium text-[var(--muted)]">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="features" className="border-b border-[var(--line)] bg-[var(--panel)] py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto mb-10 max-w-2xl text-center">
              <h2 className="text-3xl font-black tracking-normal text-[var(--foreground)] sm:text-4xl">{t("featuresTitle")}</h2>
              <p className="mt-3 text-base leading-7 text-[var(--muted)]">{t("featuresSubtitle")}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {tools.map((tool) => {
                const Icon = tool.icon;
                return (
                  <article key={tool.label} className="group rounded-md border border-[var(--line)] bg-[var(--background)] p-5 transition duration-200 hover:-translate-y-1 hover:border-[var(--accent)] hover:shadow-[var(--shadow-md)]">
                    <span className={`mb-5 flex h-11 w-11 items-center justify-center rounded-md border ${tool.tone}`}>
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <h3 className="text-base font-black text-[var(--foreground)]">{tool.label}</h3>
                    <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{tool.desc}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="mb-10 max-w-2xl">
            <h2 className="text-3xl font-black tracking-normal text-[var(--foreground)] sm:text-4xl">{t("whyTitle")}</h2>
            <p className="mt-3 text-base leading-7 text-[var(--muted)]">{t("whySubtitle")}</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {whyItems.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.title} className="rounded-md border border-[var(--line)] bg-[var(--panel)] p-5 shadow-[var(--shadow-xs)]">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-[var(--accent-muted)] text-[var(--accent)]">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h3 className="font-black text-[var(--foreground)]">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{item.desc}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="border-y border-[var(--line)] bg-[var(--panel)] py-16 sm:py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto mb-10 max-w-2xl text-center">
              <h2 className="text-3xl font-black tracking-normal text-[var(--foreground)] sm:text-4xl">{t("pricingTitle")}</h2>
              <p className="mt-3 text-base leading-7 text-[var(--muted)]">{t("pricingSubtitle")}</p>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              <PlanCard
                featured
                title={t("planFreeTitle")}
                price={t("planFreePrice")}
                period={t("planFreePeriod")}
                features={freeFeatures}
                action={t("planFreeBtn")}
              />
              <PlanCard
                title={t("planProTitle")}
                price={t("planProPrice")}
                period={t("planProPeriod")}
                badge={t("planProBadge")}
                features={proFeatures}
                action={t("planProBtn")}
              />
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
          <h2 className="text-3xl font-black tracking-normal text-[var(--foreground)] sm:text-4xl">{t("ctaTitle")}</h2>
          <p className="mx-auto mt-3 max-w-xl text-base leading-7 text-[var(--muted)]">{t("ctaSubtitle")}</p>
          <Link
            href="/app"
            className="mt-8 inline-flex h-12 items-center gap-2 rounded-md border border-[var(--accent)] bg-[var(--accent)] px-7 text-base font-bold text-[var(--panel)] shadow-[var(--shadow-accent)] transition duration-200 hover:-translate-y-0.5 hover:bg-[var(--accent-strong)] focus-visible:outline-2"
          >
            <FileText className="h-4 w-4" aria-hidden="true" />
            {t("ctaBtn")}
          </Link>
        </section>
      </main>

      <footer className="border-t border-[var(--line)] bg-[var(--panel)] py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 text-center sm:flex-row sm:px-6 sm:text-left lg:px-8">
          <div className="flex items-center gap-2">
            <OmaLogo size={26} />
            <span className="text-sm font-bold text-[var(--foreground)]">{tf("agency")}</span>
          </div>
          <div className="flex flex-col items-center gap-1 sm:items-end">
            <p className="text-xs text-[var(--muted)]">{tf("privacy")}</p>
            <p className="text-xs text-[var(--muted)]">
              {tf("copyright")}{" "}
              <a href="mailto:omadigital23@gmail.com" className="font-semibold text-[var(--accent)] hover:underline">
                {tf("contact")}
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function ProductPreview({
  title,
  status,
  drop,
  action,
  privacy,
  tools,
}: {
  title: string;
  status: string;
  drop: string;
  action: string;
  privacy: string;
  tools: CardItem[];
}) {
  return (
    <div className="relative mx-auto w-full max-w-[calc(100vw-2rem)] overflow-hidden rounded-md border border-[var(--line)] bg-[var(--panel)] p-3 shadow-[var(--shadow-xl)] sm:max-w-[500px]">
      <div className="rounded-md border border-[var(--line)] bg-[var(--panel-secondary)]">
        <div className="flex items-center justify-between gap-3 border-b border-[var(--line)] px-4 py-3">
          <div>
            <p className="text-sm font-black text-[var(--foreground)]">{title}</p>
            <p className="text-xs font-medium text-[var(--muted)]">{status}</p>
          </div>
          <span className="hidden rounded-full bg-[var(--accent-muted)] px-3 py-1 text-xs font-bold text-[var(--accent)] sm:inline-flex">{action}</span>
        </div>
        <div className="grid gap-3 p-4">
          <div className="flex min-h-32 items-center justify-center rounded-md border border-dashed border-[var(--accent-light)] bg-[var(--panel)] px-6 text-center">
            <div>
              <UploadCloud className="mx-auto mb-3 h-8 w-8 text-[var(--accent)]" aria-hidden="true" />
              <p className="text-sm font-black text-[var(--foreground)]">{drop}</p>
              <p className="mt-1 text-xs font-medium text-[var(--muted)]">{privacy}</p>
            </div>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {tools.slice(0, 4).map((tool) => {
              const Icon = tool.icon;
              return (
                <div key={tool.label} className="flex items-center gap-2 rounded-md border border-[var(--line)] bg-[var(--panel)] px-3 py-2">
                  <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md border ${tool.tone}`}>
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span className="truncate text-xs font-bold text-[var(--foreground)]">{tool.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
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
}: {
  title: string;
  price: string;
  period: string;
  features: string[];
  action: string;
  badge?: string;
  featured?: boolean;
}) {
  return (
    <article className={`relative rounded-md border bg-[var(--background)] p-6 ${featured ? "border-[var(--accent)] shadow-[var(--shadow-md)]" : "border-[var(--line)] opacity-85"}`}>
      {badge ? (
        <span className="absolute right-4 top-4 rounded-full bg-[var(--dark-muted)] px-3 py-1 text-xs font-bold text-[var(--panel)]">{badge}</span>
      ) : null}
      <p className="text-sm font-black uppercase tracking-[0.12em] text-[var(--accent)]">{title}</p>
      <div className="mt-3 flex items-end gap-2">
        <span className="text-4xl font-black text-[var(--foreground)]">{price}</span>
        <span className="pb-1 text-sm font-medium text-[var(--muted)]">{period}</span>
      </div>
      <ul className="mt-6 space-y-3">
        {features.map((feature) => (
          <li key={feature} className="flex items-center gap-2 text-sm font-medium text-[var(--foreground)]">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-[var(--accent)]" aria-hidden="true" />
            {feature}
          </li>
        ))}
      </ul>
      {featured ? (
        <Link href="/app" className="mt-6 flex h-11 w-full items-center justify-center rounded-md border border-[var(--accent)] bg-[var(--accent)] text-sm font-bold text-[var(--panel)] shadow-[var(--shadow-sm)] transition duration-200 hover:-translate-y-0.5 hover:bg-[var(--accent-strong)] focus-visible:outline-2">
          {action}
        </Link>
      ) : (
        <button type="button" disabled className="mt-6 flex h-11 w-full cursor-not-allowed items-center justify-center rounded-md border border-[var(--line)] bg-[var(--panel)] text-sm font-bold text-[var(--muted)]">
          {action}
        </button>
      )}
    </article>
  );
}
