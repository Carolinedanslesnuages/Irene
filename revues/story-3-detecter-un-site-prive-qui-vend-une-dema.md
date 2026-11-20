# Story #3 — Détecter un site privé qui vend une démarche gratuite

## Critères d'acceptation et preuves

| Critère | Test |
|---|---|
| Sur un site officiel (liste, .gouv.fr, administrations connues), rien ne se passe | `detectionRisque.spec.ts` : « ne fait rien sur un site officiel… », « site officiel » ; `analysePage.spec.ts` : « sur un site officiel, ne garde rien » |
| Page non officielle avec démarche de la liste et prix : repérée | `detectionRisque.spec.ts` : « repère une page non officielle… montant », « …mot payer », « prix sur la page » ; `analysePage.spec.ts` : « garde le site et le motif seulement » |
| Page sans rapport : invisible, rien d'affiché | `detectionRisque.spec.ts` : « reste invisible… » ; `analysePage.spec.ts` : « sans rapport… ne modifie pas la page » |
| Détection sur le texte, sans envoi hors du navigateur | `analysePage.spec.ts` : « n'envoie rien sur le réseau » ; `manifest.spec.ts` : pas de permission d'accès aux sites |
| Liste d'arnaque (précisée avec le PO) : repérée même sans prix ; livrée vide | `detectionRisque.spec.ts` : « liste des sites d'arnaque », « repère un site de la liste d'arnaque même sans prix » |

## Accessibilité

Aucun écran créé ou modifié : pas de test axe-core. Le script ne touche pas à la page (testé : le contenu est identique après analyse).
À vérifier par un humain :
- **la liste des administrations connues** (courte, proposée par ADA) ;
- **les adresses d'arnaque** à fournir (liste vide) ;
- l'avertissement des magasins d'extensions sur la lecture de toutes les pages (ADR 0002) ;
- l'essai réel dans Chrome ou Firefox (chargement de `dist/`).
L'alerte visible et ses messages (« 100 % gratuit sur service-public.fr », « frais de dossier… ») viennent avec #4.

## Périmètre

- Nouveau : détection (`src/demarches/`), script de contenu (`src/contenu/analysePage.ts`), ADR 0002, entrée de construction, déclaration du script dans le manifeste.
- Aucune permission ajoutée ; seul le nom du site et le motif sont gardés, et seulement en cas de risque.
- Le script de contenu écrit directement dans le stockage : un script de contenu ne peut pas charger de module partagé.
- Limite connue : un seul « dernier risque » est gardé, sans lien avec l'onglet ; #4 devra l'affiner.
- Pas de store Pinia : aucun écran ne lit encore ces listes.

## Résultat des contrôles

oxlint, eslint, type-check, tests (41 passés) et build : tous OK.
