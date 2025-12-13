# Blackbox – Plateforme de signalement anonyme AIGE

Application Next.js permettant de déposer rapidement un signalement anonyme pour l’Aéroport International Gnassingbé Eyadéma (AIGE). Le parcours est pensé mobile-first et se déroule en trois écrans (accueil → formulaire → confirmation) sans collecte d’identité.

## Sommaire
- Contexte & objectifs
- Parcours utilisateur
- Fonctionnalités par écran
- Stack & prérequis
- Installation / scripts
- Structure des fichiers clés
- Thème, design & assets
- Personnalisation rapide
- Intégration backend (à brancher)
- Déploiement


## Objectifs
- Offrir un canal simple et anonyme de signalement d’incident pour l’AIGE.
- Minimiser la friction : peu de champs, CTA(Call To Action) clair, retour visuel immédiat.
- Préparer l’app pour un branchement backend (envoi du signalement et upload des pièces jointes).

## Parcours utilisateur (UX)
1) Accueil : présentation brève + bouton “Faire un signalement”.
2) Formulaire : saisie des informations (zone, heure, description) et ajout de pièces jointes.
3) Confirmation : message de succès et bouton “Retour à l’accueil”.

## Fonctionnalités par écran
- `HomeScreen`
  - Branding “Blackbox”, image de fond, icône de sécurité.
  - CTA unique “Faire un signalement”.
- `ReportFormScreen`
  - Zone/Lieu : liste prédéfinie + option “Autre” avec champ libre.
  - Heure : pré-remplie à l’ouverture (format 24h), modifiable.
  - Description : zone de texte, bouton d’icône dictée vocale.
  - Pièces jointes : bloc drag/click (UI) et prévisualisations simulées. 
  - Bouton “Envoyer anonymement”.
- `ConfirmationScreen`
  - Icône de succès, message de confirmation, bouton “Retour à l’accueil”.
  - Mention “Aéroport International Gnassingbé Eyadéma”.

## Stack & prérequis
- Framework : Next.js 16 (App Router), React 19, TypeScript.
- UI : Tailwind CSS v4, composants shadcn/Radix (boutons, inputs, select), lucide-react pour les icônes.
- Thème : variables CSS (clair/sombre) dans `app/globals.css`; provider `components/theme-provider.tsx` (next-themes).
- Analytics : `@vercel/analytics` intégré dans le layout.
- Node.js : v22. 
- Gestionnaire : pnpm.

## Installation / scripts
```bash
pnpm install      # installer les dépendances
pnpm dev          # lancer en développement (http://localhost:3000)
pnpm lint         # analyser avec ESLint
pnpm build        # build production
pnpm start        # lancer le build en production
```

## Structure des fichiers clés
- `app/layout.tsx` : layout global, métadonnées, viewport, Analytics, thème en français.
- `app/page.tsx` : navigation client entre écrans via state local `currentScreen`.
- `components/screens/home-screen.tsx` : écran d’accueil + CTA.
- `components/screens/report-form-screen.tsx` : formulaire complet, états locaux (lieu, heure, description, pièces jointes simulées), `handleSubmit` appelle `onSubmit`.
- `components/screens/confirmation-screen.tsx` : écran de succès, bouton retour.
- `app/globals.css` : tokens de thème (clair/sombre), base Tailwind, rayons, couleurs.
- `components/ui/*` : bibliothèque de composants UI (boutons, inputs, select, etc.).
- `public/*` : assets (logo, fond, placeholders, icônes clair/sombre).
- `components/theme-provider.tsx` : wrapper next-themes.

## Thème, design
- Couleurs et rayons configurés dans `app/globals.css` (tokens CSS custom + `@theme inline` pour Tailwind v4).
- Mode sombre déjà stylé : bascule possible en ajoutant la logique next-themes.

## Personnalisation rapide
- Branding : remplacement des assets dans `public/` et ajustement des textes dans `components/screens/*`.
- Palette : variables CSS modifiable dans `app/globals.css`.
- Langues : textes actuellement en français.
- Boutons / rayons : tokens `--radius-*` dans `app/globals.css`.
- Formulaire : ajuster la liste des lieux (`LOCATIONS` dans `report-form-screen.tsx`), messages d’aide, limites de pièces jointes.


## Déploiement
- Compatible Vercel (Analytics déjà inclus).
- Build : `pnpm build`, run : `pnpm start`.
- Variables d’environnement : aucune requise par défaut ; ajouter vos clés backend/stockage au besoin.
- URL par défaut en dev : http://localhost:3000.
- URL de production : https://blackbox-report.vercel.app/

## Informations de connexion admin 
**Email** : dupont@gmail.com
**Password** : 12345678



