# Irène

**Objectif :** L'objectif principal du projet Irène est de protéger les usagers contre les arnaques administratives en ligne, en particulier les sites privés qui font payer à prix d'or des démarches 100 % gratuites.
**Type :** extension de navigateur (Chrome, Edge, Firefox ; sans identité de l'État)
**Stack :** Vue 3, Manifest V3 (modèle ADA `extension`)
**Permissions :** `storage`
**Créé le :** 2026-11-20 par Carolinedanslesnuages

## Lancer le projet
| Action | Commande |
|---|---|
| Fenêtre seule | `npm run dev` |
| Construire | `npm run build-only` (dossier `dist/`, voir README) |

## Stories réalisées
- #2 — Liste des démarches gratuites et sites officiels (liste fixe : démarche, site officiel gratuit, mots-clés)
- #3 — Détecter un site privé qui vend une démarche gratuite (analyse silencieuse du texte de la page ; sites officiels ignorés ; liste d'arnaque vide)
