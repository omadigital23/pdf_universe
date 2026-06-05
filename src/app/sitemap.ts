import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Sitemap généré dynamiquement pour toutes les locales
export default function sitemap(): MetadataRoute.Sitemap {
  const locales = ["fr", "en"];
  const routes = ["", "/app"];
  const lastModified = new Date("2026-06-05T00:00:00.000Z");

  return locales.flatMap((locale) =>
    routes.map((route) => ({
      url: `${SITE_URL}/${locale}${route}`,
      lastModified,
      alternates: {
        languages: {
          fr: `${SITE_URL}/fr${route}`,
          en: `${SITE_URL}/en${route}`,
          "x-default": `${SITE_URL}/fr${route}`,
        },
      },
      changeFrequency: "monthly" as const,
      priority: route === "" ? 1 : 0.8,
    })),
  );
}
