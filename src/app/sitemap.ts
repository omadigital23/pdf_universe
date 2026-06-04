import type { MetadataRoute } from "next";

// Sitemap généré dynamiquement pour toutes les locales
export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://pdf.omadigital.net";
  const locales = ["fr", "en"];
  const routes = ["", "/app"];

  return locales.flatMap((locale) =>
    routes.map((route) => ({
      url: `${base}/${locale}${route}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: route === "" ? 1 : 0.8,
    })),
  );
}
