import { SITE_URL } from "@/lib/site";

type Props = {
  locale: string;
  brand: string;
  featureList: string[];
  schemaAudience: string;
  schemaSenegal: string;
  schemaCanada: string;
  schemaWorldwide: string;
};

export function LandingJsonLd({
  locale,
  brand,
  featureList,
  schemaAudience,
  schemaSenegal,
  schemaCanada,
  schemaWorldwide,
}: Props) {
  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: brand,
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web",
          url: `${SITE_URL}/${locale}`,
          inLanguage: locale,
          availableLanguage: ["fr", "en"],
          areaServed: [
            { "@type": "Country", name: schemaSenegal },
            { "@type": "Country", name: schemaCanada },
            { "@type": "Place", name: schemaWorldwide },
          ],
          audience: {
            "@type": "Audience",
            audienceType: schemaAudience,
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
        }),
      }}
    />
  );
}
