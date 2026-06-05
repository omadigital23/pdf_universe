import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "OMA PDF Universe",
    short_name: "OMA PDF",
    description:
      "Outils PDF gratuits, local-first et sans compte pour fusionner, convertir, organiser, signer et modifier des documents.",
    id: "/fr",
    start_url: "/fr",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#f5f4ef",
    theme_color: "#0f766e",
    categories: ["business", "productivity", "utilities"],
    lang: "fr",
    dir: "ltr",
    icons: [
      {
        src: `${SITE_URL}/favicon.ico`,
        sizes: "any",
        type: "image/x-icon",
        purpose: "any",
      },
    ],
  };
}
