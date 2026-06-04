import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

// Configuration next-intl : charge les messages selon la locale de la requête
export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  // Valider la locale — repli sur la locale par défaut si invalide
  if (!locale || !routing.locales.includes(locale as "fr" | "en")) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
