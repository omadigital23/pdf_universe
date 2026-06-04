# OMA PDF Universe

OMA PDF Universe est un studio PDF local-first pour fusionner, convertir, signer et annoter des documents directement dans le navigateur.

Production cible : `https://pdf.omadigital.net`

## Stack

- Next.js 16 App Router
- React 19
- TypeScript strict
- Tailwind CSS v4
- next-intl avec routes `/fr` et `/en`
- pdf-lib, pdfjs-dist, JSZip
- Vitest pour les tests unitaires

## Scripts

```bash
npm run dev
npm run lint
npm run typecheck
npm run test
npm run build
npm run audit
npm run quality
```

`npm run quality` execute lint, typecheck, tests, build et audit high-level.

## Architecture

```text
messages/                 Traductions FR/EN
src/app/[locale]/         Routes localisees
src/components/app/       Shell client du studio PDF
src/components/tools/     Outils PDF independants
src/components/shared/    UI partagee
src/i18n/                 Routing next-intl
src/lib/                  Types et utilitaires PDF
proxy.ts                  Routage i18n Next 16
```

## Confidentialite

Les fichiers sont traites dans le navigateur. Aucune route API ne recoit les PDF, images ou signatures.

## Qualite

La CI GitHub lance :

- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm run build`
- `npm run audit`

## Deploiement

Le projet est pret pour Vercel. Aucun secret n'est requis pour la version gratuite actuelle.
