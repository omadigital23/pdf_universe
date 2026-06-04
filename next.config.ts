import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

// Intégration next-intl avec le fichier de configuration i18n
const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  // Optimisation des images désactivée (traitement local uniquement)
  images: {
    unoptimized: true,
  },
};

export default withNextIntl(nextConfig);
