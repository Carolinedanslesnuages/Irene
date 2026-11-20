# Irène

Irène protège les usagers contre les arnaques administratives en ligne. Elle affiche une alerte :

- quand vous êtes sur un **site frauduleux** ;
- quand vous n'êtes **pas sur le site officiel** de votre démarche, souvent gratuite ou moins chère
  sur le site de l'État.

Extension de navigateur créée avec ADA (Vue 3, Manifest V3 : Chrome, Edge, Firefox), sans
identité de l'État. Fiche projet : [PROJET.md](PROJET.md) ; consignes pour les agents de code :
[AGENTS.md](AGENTS.md) ; décisions d'architecture : [docs/adr/](docs/adr/0001-choix-de-la-stack.md).

## Essayer l'extension
1. `npm ci && npm run build-only` : l'extension est construite dans `dist/`.
2. **Chrome ou Edge** : ouvrir `chrome://extensions` (ou `edge://extensions`), activer le
   « Mode développeur », cliquer sur « Charger l'extension non empaquetée » et choisir `dist/`.
3. **Firefox** : ouvrir `about:debugging#/runtime/this-firefox`, « Charger un module
   complémentaire temporaire » et choisir `dist/manifest.json`.
