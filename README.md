# Irène

Irène protège les usagers contre les arnaques administratives en ligne. Elle affiche une alerte :

- quand vous êtes sur un **site frauduleux** ;
- quand vous n'êtes **pas sur le site officiel** de votre démarche, souvent gratuite ou moins chère
  sur le site de l'État.

Le nom rend hommage à Irène Frachon, pneumologue au CHU de Brest et lanceuse d'alerte : elle a
mis au jour les dangers du Mediator, retiré du marché en 2009, et s'est battue pour que les
victimes soient reconnues. Irène, l'extension, est la lanceuse d'alerte de vos démarches en ligne.

Extension de navigateur (Vue 3, Manifest V3 : Chrome, Edge, Firefox), sans identité de l'État.

## Ce qu'elle fait

- **Elle reconnaît une démarche vendue ailleurs que sur le site officiel.** Carte grise, permis
  de conduire, certificat de non-gage, acte de naissance, passeport, carte d'identité,
  inscription sur les listes électorales, extrait Kbis, immatriculation d'entreprise : sur un
  site privé qui les propose, elle repère la démarche, le prix affiché et les mentions qui font
  croire à un site officiel.
- **Elle connaît les sites d'arnaque.** Une liste noire officielle d'environ 3 500 adresses de
  sites et de courriels frauduleux, sous-domaines compris.
- **Elle prévient avant le paiement.** L'alerte donne le lien du site officiel, s'ouvre sans
  nouvelle fenêtre, s'annonce aux lecteurs d'écran et se ferme au clavier.
- **Elle vous laisse la main.** Un site peut être ignoré depuis l'alerte et réactivé depuis la
  fenêtre de l'extension. Irène se coupe et se rallume d'un clic, et le réglage est gardé.

## Ce qu'elle ne fait pas

L'analyse se fait dans le navigateur. Irène ne modifie pas les pages et n'envoie rien. Elle ne
garde que le nom d'un site à risque et la raison de l'alerte. À l'installation, le navigateur
signale qu'elle lit les sites visités : c'est ce qui lui permet d'analyser la page sans que vous
ayez à cliquer ([décision 0002](docs/adr/0002-analyse-silencieuse-des-pages.md)).

## Essayer l'extension

1. `npm ci && npm run build-only` : l'extension est construite dans `dist/`.
2. **Chrome ou Edge** : ouvrir `chrome://extensions` (ou `edge://extensions`), activer le
   « Mode développeur », cliquer sur « Charger l'extension non empaquetée » et choisir `dist/`.
3. **Firefox** : ouvrir `about:debugging#/runtime/this-firefox`, « Charger un module
   complémentaire temporaire » et choisir `dist/manifest.json`.

Pour voir l'alerte sans risque, lancez `npm run dev` puis ouvrez
`http://arnaque-test.localhost:5173/page-test-arnaque.html` : une page inoffensive, sous une
adresse qui imite un site de la liste noire. Les tests : `npm run test:unit`.

Fiche projet : [PROJET.md](PROJET.md) ; consignes pour les agents de code :
[AGENTS.md](AGENTS.md) ; décisions d'architecture : [docs/adr/](docs/adr/0001-choix-de-la-stack.md).
