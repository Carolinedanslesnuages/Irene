/**
 * Moteurs de recherche : leurs pages de résultats citent des démarches et des prix qui viennent
 * d'autres sites. Irène ne les analyse pas : l'alerte n'a de sens que sur le site visité lui-même.
 */
const MOTEURS_DE_RECHERCHE = [
  /(?:^|\.)google\.[a-z]{2,3}(?:\.[a-z]{2})?$/,
  /(?:^|\.)bing\.com$/,
  /(?:^|\.)duckduckgo\.com$/,
  /(?:^|\.)qwant\.com$/,
  /(?:^|\.)ecosia\.org$/,
  /(?:^|\.)yahoo\.(?:com|fr)$/,
  /(?:^|\.)search\.brave\.com$/,
  /(?:^|\.)startpage\.com$/,
]

export function estMoteurDeRecherche(nomDeSite: string): boolean {
  const nomEnMinuscules = nomDeSite.toLowerCase()
  return MOTEURS_DE_RECHERCHE.some((motif) => motif.test(nomEnMinuscules))
}
