# Story #2 — Liste des démarches gratuites et sites officiels

## Critères d'acceptation et preuves

| Critère | Test |
|---|---|
| La liste contient chaque démarche et son site officiel gratuit (service-public.fr, infogreffe.fr, ants.gouv.fr) | `demarchesGratuites.spec.ts` : « donne à chaque démarche un nom et un site officiel… » et « utilise les trois sites officiels prévus » |
| Chaque démarche a des mots-clés qui permettent de la reconnaître sur une page | `demarchesGratuites.spec.ts` : « au moins un mot-clé… sans doublon » ; « rattache carte grise… » ; accents/majuscules ; texte sans rapport |

## Accessibilité

Aucun écran créé ou modifié : pas de test axe-core nécessaire.
À vérifier par un humain : **la liste des démarches, des sites et des mots-clés** (contenu métier, proposé par ADA).

## Périmètre

- Liste fixe intégrée à l'extension (`src/demarches/`), sans permission nouvelle ni appel réseau.
- Pas de store Pinia : la liste est seulement lue.
- Rien d'autre modifié.

## Résultat des contrôles

oxlint, eslint, type-check, tests (20 passés) et build : tous OK.
