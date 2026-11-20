# Story #5 — Désactiver l'alerte pour un site

Règles tranchées par le PO : « un site » = le site entier, sous-domaines compris ; retrait depuis la liste **et** depuis le site en cours.

## Critères d'acceptation et preuves

| Critère | Test |
|---|---|
| Bouton « Ne plus m'alerter sur ce site » dans l'alerte | `alerteModale.spec.ts` : « propose « Ne plus m'alerter sur ce site »… » |
| Un clic ignore le site entier, sous-domaines compris | `analysePage.spec.ts` : « « Ne plus m'alerter » garde le site entier, puis n'alerte plus… » ; `sitesIgnores.spec.ts` (site entier, `.co.uk`) |
| Choix gardé après fermeture du navigateur | `analysePage.spec.ts` : « le choix est gardé après fermeture… » ; `sitesIgnoresFenetre.spec.ts` : « liste les sites gardés… » |
| Retrait depuis la fenêtre (liste) | `sitesIgnoresFenetre.spec.ts` : « réactive l'alerte depuis la liste… » |
| Retrait pour le site en cours | `sitesIgnoresFenetre.spec.ts` : « indique si le site en cours est ignoré et le réactive… » |
| Liste vide, échec d'enregistrement | mêmes fichiers : « dit quand la liste est vide », « prévient quand l'enregistrement échoue » |

## Accessibilité

Tests axe-core ajoutés : alerte avec le nouveau bouton, fenêtre avec liste et site en cours (aucune violation).
Boutons natifs, intitulé du bouton de liste nommant le site, liste `ul`, titre `h2` sous le `h1`, réactivation annoncée (`role="status"`), erreur en `role="alert"`, texte « active / désactivée » (pas de couleur seule).
À vérifier par un humain :
- lecture avec un lecteur d'écran et ordre de tabulation dans l'alerte et la fenêtre ;
- lisibilité à 320 px et contrastes en thème clair et sombre ;
- le focus visible du nouveau bouton dans l'alerte, sur une vraie page.

## Décision d'architecture (à relire par un développeur)

- Nouvelle permission `activeTab` (ADR 0003) : sert uniquement à lire le site de l'onglet en cours, au clic sur l'icône.
- Le script de contenu ne peut pas charger de fichier partagé : il importe la règle des sites ignorés avec le suffixe `?autonome`, qui en fait une copie dans son fichier (vérifié : aucun `import` dans `analysePage.js`).
- La règle `.co.uk` repose sur une courte liste de fins à deux niveaux (`.co.uk`, `.com.au`, `.asso.fr`…) : à compléter si besoin.

## Périmètre

Ajouts : règle des sites ignorés, store, composant de liste, accès à l'onglet actif, bouton dans l'alerte, filtrage dans l'analyse, styles de la liste, ADR 0003, manifeste et son test.
Hors périmètre, non traité : couper Irène partout (#6).

## Résultat des contrôles

oxlint, eslint, type-check, tests (78) et build : tous OK.
