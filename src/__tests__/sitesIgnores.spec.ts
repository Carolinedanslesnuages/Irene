import { describe, expect, it } from 'vitest'
import { ajouterSiteIgnore, estSiteIgnore, retirerSiteIgnore, trouverSiteEntier } from '../demarches/sitesIgnores'

describe('site entier, sous-domaines compris', () => {
  it('ramène un sous-domaine au site entier', () => {
    expect(trouverSiteEntier('www.monsite.fr')).toBe('monsite.fr')
    expect(trouverSiteEntier('boutique.paiement.monsite.fr')).toBe('monsite.fr')
    expect(trouverSiteEntier('MonSite.fr')).toBe('monsite.fr')
  })

  it('gère les adresses à deux niveaux comme .co.uk', () => {
    expect(trouverSiteEntier('www.monsite.co.uk')).toBe('monsite.co.uk')
    expect(trouverSiteEntier('monsite.co.uk')).toBe('monsite.co.uk')
  })

  it('laisse intactes les adresses sans sous-domaine, localhost et IP', () => {
    expect(trouverSiteEntier('monsite.fr')).toBe('monsite.fr')
    expect(trouverSiteEntier('localhost')).toBe('localhost')
    expect(trouverSiteEntier('192.168.0.12')).toBe('192.168.0.12')
  })

  it('reconnaît un site ignoré depuis n’importe quel sous-domaine, mais pas un autre site', () => {
    const sitesIgnores = ['monsite.fr']
    expect(estSiteIgnore(sitesIgnores, 'www.monsite.fr')).toBe(true)
    expect(estSiteIgnore(sitesIgnores, 'autresite.fr')).toBe(false)
    expect(estSiteIgnore(sitesIgnores, 'monsite.fr.pirate.com')).toBe(false)
  })

  it('ajoute sans doublon et retire par le site entier', () => {
    const apresAjout = ajouterSiteIgnore(ajouterSiteIgnore([], 'www.monsite.fr'), 'monsite.fr')
    expect(apresAjout).toEqual(['monsite.fr'])
    expect(retirerSiteIgnore(apresAjout, 'boutique.monsite.fr')).toEqual([])
  })
})
