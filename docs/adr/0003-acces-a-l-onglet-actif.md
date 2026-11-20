# ADR-0003 — Accès à l'onglet actif (permission `activeTab`)

- **Statut** : Proposed (à relire par un développeur)
- **Date** : 2026-11-20
- **Décideurs** : Carolinedanslesnuages, via ADA
- **Sujet** : story #5, désactiver l'alerte pour un site

## Contexte
La fenêtre de l'extension doit dire si le site de l'onglet en cours est ignoré, et permettre de le réactiver.

## Décision
Ajout de la permission `activeTab`. Elle ne donne l'adresse de l'onglet qu'au clic de l'usager sur l'icône de l'extension. Aucun `host_permissions`, aucune permission `tabs`.

## Conséquences
- **À relire** : une permission de plus dans le manifeste.
- Seul le nom du site est utilisé, jamais le détail de l'adresse ; rien n'est gardé ni envoyé.
- Les sites ignorés sont gardés dans `chrome.storage.local` (clé `sitesIgnores`), sans autre donnée.
