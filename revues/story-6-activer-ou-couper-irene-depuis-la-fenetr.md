# Story #6 — Activer ou couper Irène depuis la fenêtre de l'extension

## Critères d'acceptation et preuves

| Critère | Test |
|---|---|
| La fenêtre affiche en texte si Irène est active ou coupée | `App.spec.ts` : « affiche en texte si Irène est active ou coupée » ; « enregistre le changement et l'annonce » |
| Le réglage est conservé entre deux sessions | `App.spec.ts` : « garde le réglage : coupée puis fenêtre rouverte… » |
| Irène coupée : aucune alerte | `analysePage.spec.ts` : « Irène coupée : aucune alerte et rien de gardé… » ; « Irène réactivée : l'alerte revient » |

## Accessibilité

Test axe-core de la fenêtre : aucune violation.
Case à cocher native « Activer Irène » avec étiquette visible liée ; état écrit « Irène est active / coupée » (pas de couleur seule) ; changement annoncé (`role="status"`) ; erreur d'enregistrement en `role="alert"`.
À vérifier par un humain :
- lecture avec un lecteur d'écran (annonce du changement d'état) ;
- usage au clavier, focus visible, lisibilité à 320 px ;
- test réel dans Chrome ou Firefox : couper Irène, ouvrir une page à risque, constater l'absence d'alerte.

## Décisions

- Le réglage existait déjà (store, stockage) mais l'alerte l'ignorait : le script de page le lit désormais avant toute analyse.
- Absence de réglage = Irène active (valeur par défaut inchangée). Aucune nouvelle permission, aucun nouveau store.
- Couper Irène s'applique aux pages ouvertes à partir du moment du réglage (une alerte déjà affichée reste).

## Périmètre

Modifiés : fenêtre (libellés et état), script de page (lecture du réglage), tests associés, PROJET.md.
Rien d'autre.

## Résultat des contrôles

oxlint, eslint, type-check, tests (82) et build : tous OK.
