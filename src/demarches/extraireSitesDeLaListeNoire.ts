const FORME_NOM_DE_SITE = /^(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}$/

/** Ramène une ligne de la liste noire (adresse de site ou courriel) à un nom de site, ou null. */
function nomDeSiteDeLaLigne(valeur: string): string | null {
  let nom = valeur.replace(/^"|"$/g, '').trim().toLowerCase()
  nom = nom.replace(/^https?:\/\//, '').replace(/\/.*$/, '')
  if (nom.includes('@')) nom = nom.split('@').pop() ?? ''
  nom = nom.replace(/^www\./, '')
  return FORME_NOM_DE_SITE.test(nom) ? nom : null
}

/** Extrait les noms de site (sans doublon) d'un CSV « nom;categorie;date » avec ligne d'en-tête. */
export function extraireSitesDeLaListeNoire(contenuCsv: string): string[] {
  const sansMarqueOctets = contenuCsv.charCodeAt(0) === 0xfeff ? contenuCsv.slice(1) : contenuCsv
  const sites = new Set<string>()
  for (const ligne of sansMarqueOctets.split(/\r?\n/).slice(1)) {
    const nom = nomDeSiteDeLaLigne(ligne.split(';')[0] ?? '')
    if (nom) sites.add(nom)
  }
  return [...sites].sort()
}
