import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PdfAppClient } from "@/components/app/PdfAppClient";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
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
        "x-default": "/fr/app",
      },
    },
    openGraph: {
      title: app("pageTitle"),
      description: app("pageDescription"),
      url: `https://pdfuniverse.omadigital.net/${locale}/app`,
      images: ["/opengraph-image"],
    },
    twitter: {
      card: "summary_large_image",
      title: app("pageTitle"),
      description: app("pageDescription"),
    },
  };
}

export default async function AppPage({ params }: Props) {
  const { locale } = await params;

  return <PdfAppClient locale={locale} />;
}
