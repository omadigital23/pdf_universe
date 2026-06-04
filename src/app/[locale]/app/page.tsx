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
  const app = await getTranslations({ locale, namespace: "app" });
  const landing = await getTranslations({ locale, namespace: "landing" });

  const featureList = [
    app("tools.merge.label"),
    app("tools.imagesToPdf.label"),
    app("tools.pdfToImages.label"),
    app("tools.sign.label"),
    app("tools.edit.label"),
  ];

  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: app("pageTitle"),
            description: app("pageDescription"),
            applicationCategory: "BusinessApplication",
            operatingSystem: "Web",
            url: `https://pdfuniverse.omadigital.net/${locale}/app`,
            inLanguage: locale,
            availableLanguage: ["fr", "en"],
            areaServed: [
              { "@type": "Country", name: landing("schemaSenegal") },
              { "@type": "Country", name: landing("schemaCanada") },
              { "@type": "Place", name: landing("schemaWorldwide") },
            ],
            audience: {
              "@type": "Audience",
              audienceType: landing("schemaAudience"),
            },
            featureList,
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
            potentialAction: {
              "@type": "UseAction",
              target: `https://pdfuniverse.omadigital.net/${locale}/app`,
            },
          }),
        }}
      />
      <PdfAppClient locale={locale} />
    </>
  );
}
