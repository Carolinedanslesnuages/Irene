# ADR-0002 — Analyse silencieuse des pages par un script de contenu

- **Statut** : Proposed (à relire par un développeur)
- **Date** : 2026-11-20
- **Décideurs** : Carolinedanslesnuages, via ADA
- **Sujet** : story #3, détecter un site privé qui vend une démarche gratuite

## Contexte
Irène doit lire le texte des pages consultées pour repérer une démarche gratuite vendue sur un site non officiel.

## Décision
Un script de contenu (`content_scripts`, pages `http` et `https`) analyse le texte dans le navigateur. Il ne modifie pas la page et n'envoie rien. Aucune permission n'est ajoutée à `permissions` ni à `host_permissions`.

## Conséquences
- **À relire** : le script s'exécute sur toutes les pages web ; les magasins d'extensions affichent un avertissement de lecture des sites visités.
- `activeTab` ne convient pas : l'analyse doit être automatique, sans clic de l'usager.
- Seul le nom du site et le motif sont gardés, et seulement pour une page à risque.
