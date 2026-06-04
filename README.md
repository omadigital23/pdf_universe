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
- Playwright pour les parcours e2e desktop/mobile Chromium

## Scripts

```bash
npm run dev
npm run lint
npm run typecheck
npm run test
npm run test:e2e
npm run build
npm run audit
npm run quality
```

`npm run quality` execute lint, typecheck, tests unitaires, build, tests e2e et audit high-level.

## Architecture

```text
messages/                 Traductions FR/EN
src/app/[locale]/         Routes localisees
src/components/app/       Shell client du studio PDF
src/components/tools/     Outils PDF independants
src/components/shared/    UI partagee
src/i18n/                 Routing next-intl
src/lib/                  Types, utilitaires PDF et diagnostics locaux
proxy.ts                  Routage i18n Next 16
tests/e2e/                QA navigateur Playwright
```

## Confidentialite

Les fichiers sont traites dans le navigateur. Aucune route API ne recoit les PDF, images ou signatures.

## Diagnostics produit

L'app enregistre des evenements techniques local-first dans `localStorage` uniquement :

- ouverture de l'app et selection d'outil ;
- fichiers ajoutes ou retires, sans contenu ni nom de fichier ;
- lancement, succes et erreurs de traitement ;
- erreurs runtime React capturees par l'error boundary.

Le panneau Diagnostics permet d'exporter un rapport JSON local pour le support. Rien n'est envoye a un serveur.

## Qualite

La CI GitHub lance :

- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm run build`
- `npm run test:e2e`
- `npm run audit`

Les tests e2e couvrent :

- landing page FR/EN et routage localise ;
- rendu des cinq outils et fallback d'outil invalide ;
- absence de debordement horizontal desktop/mobile Chromium ;
- fusion de vrais PDF generes pendant le test ;
- conversion de vrais PNG en PDF ;
- export d'un PDF genere en archive ZIP d'images ;
- signature dessinee sur canvas et appliquee a un PDF ;
- ajout de texte sur un PDF genere ;
- erreur recuperable sur PDF corrompu ;
- export du rapport Diagnostics.

Limite actuelle : la validation Safari iOS et Chrome Android sur appareils reels doit etre executee avant une mise en production critique, via appareils physiques ou une ferme de navigateurs. La suite locale couvre Chromium desktop et mobile emule.

## Deploiement

Le projet est pret pour Vercel. Aucun secret n'est requis pour la version gratuite actuelle.
