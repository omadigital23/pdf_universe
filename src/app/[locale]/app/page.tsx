import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PdfAppClient } from "@/components/app/PdfAppClient";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  const app = await getTranslations({ locale, namespace: "app" });

  return {
    metadataBase: new URL("https://pdfuniverse.omadigital.net"),
    title: app("pageTitle"),
    description: app("pageDescription"),
    alternates: {
      canonical: `/${locale}/app`,
      languages: {
        fr: "/fr/app",
        en: "/en/app",
      },
    },
    openGraph: {
      title: app("pageTitle"),
      description: t("ogDescription"),
      url: `https://pdfuniverse.omadigital.net/${locale}/app`,
      images: ["/opengraph-image"],
    },
  };
}

export default async function AppPage({ params }: Props) {
  const { locale } = await params;

  return <PdfAppClient locale={locale} />;
}
