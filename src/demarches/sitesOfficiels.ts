import { SITES_OFFICIELS_GRATUITS } from './demarchesGratuites'

/**
 * Administrations connues dont l'adresse n'est pas en .gouv.fr. Liste courte, à compléter
 * par le Product Owner.
 */
export const ADMINISTRATIONS_CONNUES = [
  'ameli.fr',
  'caf.fr',
  'francetravail.fr',
  'legifrance.fr',
  'urssaf.fr',
  'info-retraite.fr',
  'lassuranceretraite.fr',
] as const

const SUFFIXE_GOUVERNEMENT = 'gouv.fr'

function appartientAuDomaine(nomDeSite: string, domaine: string): boolean {
  return nomDeSite === domaine || nomDeSite.endsWith(`.${domaine}`)
}

/** Vrai pour la liste officielle, tout site en .gouv.fr et les administrations connues. */
export function estSiteOfficiel(nomDeSite: string): boolean {
  const nomEnMinuscules = nomDeSite.toLowerCase()
  const domainesOfficiels: readonly string[] = [
    ...SITES_OFFICIELS_GRATUITS,
    ...ADMINISTRATIONS_CONNUES,
    SUFFIXE_GOUVERNEMENT,
  ]
  return domainesOfficiels.some((domaine) => appartientAuDomaine(nomEnMinuscules, domaine))
}
