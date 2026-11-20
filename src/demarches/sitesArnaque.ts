import listeNoireCsv from '../../listenoires.csv?raw'
import { extraireSitesDeLaListeNoire } from './extraireSitesDeLaListeNoire'

/**
 * Sites d'arnaque connus (noms de site, sans « https:// »), tirés de la liste noire officielle
 * fournie par le Product Owner (listenoires.csv, à la racine du projet).
 */
export const SITES_ARNAQUE: readonly string[] = extraireSitesDeLaListeNoire(listeNoireCsv)

export function estSiteArnaque(nomDeSite: string, sitesArnaque: readonly string[] = SITES_ARNAQUE): boolean {
  const nomEnMinuscules = nomDeSite.toLowerCase()
  return sitesArnaque.some((siteArnaque) => {
    const siteEnMinuscules = siteArnaque.toLowerCase()
    return nomEnMinuscules === siteEnMinuscules || nomEnMinuscules.endsWith(`.${siteEnMinuscules}`)
  })
}
