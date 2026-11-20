/**
 * Sites que l'usager a choisi de ne plus être alerté. « Un site » = le site entier,
 * sous-domaines compris (monsite.fr couvre www.monsite.fr et boutique.monsite.fr).
 */
export const CLE_SITES_IGNORES = 'sitesIgnores'

/** Fins d'adresse à deux niveaux : le site entier prend alors trois parties (ex. monsite.co.uk). */
const FINS_A_DEUX_NIVEAUX = [
  'co.uk', 'org.uk', 'ac.uk', 'gov.uk', 'me.uk',
  'com.au', 'net.au', 'org.au', 'co.nz', 'co.jp', 'co.za', 'com.br', 'com.mx', 'co.in',
  'asso.fr', 'com.fr', 'gouv.fr',
]

const ressembleAUneAdresseIp = (nomDeSite: string): boolean => /^[\d.]+$/.test(nomDeSite) || nomDeSite.includes(':')

/** Renvoie le site entier d'une adresse : « www.monsite.fr » → « monsite.fr ». */
export function trouverSiteEntier(nomDeSite: string): string {
  const nomPropre = nomDeSite.trim().toLowerCase().replace(/\.$/, '')
  const parties = nomPropre.split('.')
  if (parties.length <= 2 || ressembleAUneAdresseIp(nomPropre)) return nomPropre
  const deuxDernieresParties = parties.slice(-2).join('.')
  const nombreDeParties = FINS_A_DEUX_NIVEAUX.includes(deuxDernieresParties) ? 3 : 2
  return parties.slice(-nombreDeParties).join('.')
}

export function estSiteIgnore(sitesIgnores: readonly string[], nomDeSite: string): boolean {
  return sitesIgnores.includes(trouverSiteEntier(nomDeSite))
}

export function ajouterSiteIgnore(sitesIgnores: readonly string[], nomDeSite: string): string[] {
  const siteEntier = trouverSiteEntier(nomDeSite)
  return sitesIgnores.includes(siteEntier) ? [...sitesIgnores] : [...sitesIgnores, siteEntier]
}

export function retirerSiteIgnore(sitesIgnores: readonly string[], nomDeSite: string): string[] {
  const siteEntier = trouverSiteEntier(nomDeSite)
  return sitesIgnores.filter((siteIgnore) => siteIgnore !== siteEntier)
}
