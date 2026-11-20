/**
 * Sites d'arnaque connus (noms de site, sans « https:// »). Livrée vide : aucune adresse
 * n'est inventée, le Product Owner la fournit. Accuser à tort un site réel serait grave.
 */
export const SITES_ARNAQUE: readonly string[] = []

export function estSiteArnaque(nomDeSite: string, sitesArnaque: readonly string[] = SITES_ARNAQUE): boolean {
  const nomEnMinuscules = nomDeSite.toLowerCase()
  return sitesArnaque.some((siteArnaque) => {
    const siteEnMinuscules = siteArnaque.toLowerCase()
    return nomEnMinuscules === siteEnMinuscules || nomEnMinuscules.endsWith(`.${siteEnMinuscules}`)
  })
}
