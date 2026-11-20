# ADR-0001 — Choix de la stack : extension Vue 3, Manifest V3

- **Statut** : Accepted
- **Date** : 2026-11-20
- **Décideurs** : Carolinedanslesnuages
- **Sujet** : stack technique du projet Irène

## Contexte
Irène protège les usagers contre les arnaques administratives en ligne : elle alerte quand un site
est frauduleux, et quand un site privé fait payer une démarche gratuite ou moins chère sur le site
officiel de l'État. Le besoin se situe dans le navigateur de l'utilisateur, sur les pages qu'il
consulte déjà.

## Options considérées
### Option A — Extension Vue 3, Manifest V3, une seule base pour Chrome, Edge et Firefox
- Outillage éprouvé : Vue 3, Vitest, lint d'accessibilité.
- Permissions minimales au départ (`storage`), ajoutées une à une et justifiées.
### Option B — Service en ligne séparé
- **Pourquoi pas** : l'utilisateur devrait quitter la page sur laquelle il travaille.

## Décision
**Option retenue : A.** Aucune identité de l'État (ni Marianne, ni DSFR) : une extension n'est
pas un site de l'État.

## Conséquences
- **Positives** : au plus près du travail de l'utilisateur ; un seul code pour trois navigateurs.
- **Négatives** : publication dans les magasins d'extensions à prévoir.
- **À surveiller** : chaque nouvelle permission (accès aux sites, onglets) = une ADR.

## Suivi
- [x] Implémentation : création du projet
