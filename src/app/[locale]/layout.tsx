import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

// Génération des métadonnées dynamiques par locale
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  return {
    title: {
      default: t("title"),
      template: `%s | OMA PDF`,
    },
    description: t("description"),
    metadataBase: new URL("https://pdf.omadigital.net"),
    openGraph: {
      title: t("ogTitle"),
      description: t("ogDescription"),
      url: "https://pdf.omadigital.net",
      images: ["/opengraph-image"],
      siteName: "OMA PDF",
      locale: locale === "fr" ? "fr_FR" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t("ogTitle"),
      description: t("ogDescription"),
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

// Génération statique des locales supportées
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  // Valider la locale — 404 si invalide
  if (!routing.locales.includes(locale as "fr" | "en")) {
    notFound();
  }

  // Charger les messages pour le provider client
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <div lang={locale} className="min-h-full bg-[var(--background)] text-[var(--foreground)]">
        {children}
      </div>
    </NextIntlClientProvider>
  );
}
