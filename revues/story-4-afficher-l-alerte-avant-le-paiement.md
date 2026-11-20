# Story #4 — Afficher l'alerte avant le paiement

Décision du PO : l'alerte livrée avec #3 est considérée comme suffisante. Aucun changement à l'écran ; seuls des tests sont ajoutés.

## Critères d'acceptation et preuves

| Critère | Test (`alerteModale.spec.ts`) |
|---|---|
| Message clair sur le site non officiel, avec l'adresse officielle | « affiche en grand la bonne adresse… », « prévient des frais de dossier possibles » |
| Lien explicite vers le site officiel, sans nouvelle fenêtre | « donne un lien explicite vers le site officiel, sans ouvrir de nouvelle fenêtre » |
| Fermeture au clavier comme à la souris | « se ferme avec « Rester sur ce site » » ; « se ferme au clavier… » |
| Annoncée aux lecteurs d'écran, pas par la couleur seule | « est annoncée comme alerte… » ; « est une fenêtre nommée par son titre » ; test axe-core |

## Écart assumé

Le message ne dit pas « Cette démarche est gratuite sur le site officiel » et s'affiche dès l'ouverture de la page, pas au moment du paiement. Le PO a choisi de clore #4 ainsi.

## Accessibilité

Écran non modifié ; test axe-core existant conservé (aucune violation).
À vérifier par un humain :
- fermeture avec la touche Échap et retour du focus dans un vrai navigateur (non testable ici) ;
- lecture réelle avec un lecteur d'écran ;
- contraste et focus visibles en thème clair et sombre.

## Périmètre

Seul le fichier de tests de l'alerte est modifié, plus cette fiche et PROJET.md.

## Résultat des contrôles

oxlint, eslint, type-check, tests et build : tous OK.
