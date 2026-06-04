import { defineRouting } from "next-intl/routing";

// Définition du routing i18n : locales supportées et préfixe toujours présent
export const routing = defineRouting({
  locales: ["fr", "en"],
  defaultLocale: "fr",
  localePrefix: "always",
  alternateLinks: false,
});
