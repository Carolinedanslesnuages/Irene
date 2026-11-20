import { describe, expect, it } from 'vitest'
import { evaluerRisque } from '../demarches/detectionRisque'
import { estMoteurDeRecherche } from '../demarches/moteursDeRecherche'

const RESULTATS_CARTE_GRISE =
  'carte grise en ligne : tarifs, service agréé et habilité, payer 29,90 € - Résultats de recherche'

describe('moteur de recherche', () => {
  it('reconnaît les moteurs courants et leurs variantes de pays', () => {
    for (const nomDeSite of ['www.google.com', 'google.fr', 'www.bing.com', 'duckduckgo.com', 'www.qwant.com', 'fr.search.yahoo.com', 'www.ecosia.org']) {
      expect(estMoteurDeRecherche(nomDeSite)).toBe(true)
    }
  })

  it('ne confond pas un site privé qui imite un moteur', () => {
    expect(estMoteurDeRecherche('google.fr.cartegrise-express.com')).toBe(false)
    expect(estMoteurDeRecherche('faux-google.fr')).toBe(false)
  })

  it('n’alerte pas sur une page de résultats, même pleine de mots de démarche et de prix', () => {
    for (const adresse of ['https://www.google.com/search?q=carte+grise', 'https://www.bing.com/search?q=carte+grise']) {
      expect(evaluerRisque({ adresse, textePage: RESULTATS_CARTE_GRISE }).risque).toBe(false)
    }
  })
})
