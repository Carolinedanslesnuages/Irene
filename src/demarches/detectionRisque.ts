import { trouverDemarcheDansTexte } from './reconnaissanceDemarche'
import { aUneMentionOfficielleTrompeuse } from './mentionOfficielleTrompeuse'
import { aUnPrixSurLaPage } from './prixSurLaPage'
import { estSiteArnaque, SITES_ARNAQUE } from './sitesArnaque'
import { estSiteOfficiel } from './sitesOfficiels'

export type ResultatAnalyse =
  | { risque: false; motif: null }
  | { risque: true; motif: 'site-arnaque' }
  | { risque: true; motif: 'demarche-payante'; demarche: string; siteOfficiel: string }

interface PageAnalysee {
  adresse: string
  textePage: string
  sitesArnaque?: readonly string[]
}

const AUCUN_RISQUE: ResultatAnalyse = { risque: false, motif: null }

function lireNomDeSite(adresse: string): string | null {
  try {
    const url = new URL(adresse)
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.hostname : null
  } catch {
    return null
  }
}

/** Analyse le texte d'une page, sans rien envoyer : repère seulement, n'affiche rien. */
export function evaluerRisque({ adresse, textePage, sitesArnaque = SITES_ARNAQUE }: PageAnalysee): ResultatAnalyse {
  const nomDeSite = lireNomDeSite(adresse)
  if (nomDeSite === null || estSiteOfficiel(nomDeSite)) return AUCUN_RISQUE
  if (estSiteArnaque(nomDeSite, sitesArnaque)) return { risque: true, motif: 'site-arnaque' }

  const demarche = trouverDemarcheDansTexte(textePage)
  if (demarche && (aUnPrixSurLaPage(textePage) || aUneMentionOfficielleTrompeuse(textePage))) {
    return { risque: true, motif: 'demarche-payante', demarche: demarche.nom, siteOfficiel: demarche.siteOfficiel }
  }
  return AUCUN_RISQUE
}
