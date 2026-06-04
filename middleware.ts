import createMiddleware from "next-intl/middleware";
import { routing } from "./src/i18n/routing";

// Middleware next-intl : gère la redirection automatique vers la locale
export default createMiddleware(routing);

export const config = {
  // Matcher : toutes les routes sauf _next, api, et assets statiques
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
