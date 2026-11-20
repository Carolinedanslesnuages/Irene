import { describe, expect, it } from 'vitest'
import { evaluerRisque } from '../demarches/detectionRisque'
import { aUnPrixSurLaPage } from '../demarches/prixSurLaPage'
import { estSiteOfficiel } from '../demarches/sitesOfficiels'
import { estSiteArnaque, SITES_ARNAQUE } from '../demarches/sitesArnaque'

const PAGE_CARTE_GRISE_PAYANTE = 'Votre carte grise en 5 minutes pour seulement 29,90 €'

describe('site officiel', () => {
  it('reconnaît les trois sites de la liste et leurs sous-domaines', () => {
    expect(estSiteOfficiel('service-public.fr')).toBe(true)
    expect(estSiteOfficiel('www.infogreffe.fr')).toBe(true)
    expect(estSiteOfficiel('ants.gouv.fr')).toBe(true)
  })

  it('reconnaît tout site en .gouv.fr et les administrations connues en .fr', () => {
    expect(estSiteOfficiel('impots.gouv.fr')).toBe(true)
    expect(estSiteOfficiel('www.ameli.fr')).toBe(true)
  })

  it('ne confond pas un site privé qui imite un nom officiel', () => {
    expect(estSiteOfficiel('service-public.fr.paiement-rapide.com')).toBe(false)
    expect(estSiteOfficiel('faux-service-public.fr')).toBe(false)
    expect(estSiteOfficiel('gouv.fr.exemple.com')).toBe(false)
    expect(estSiteOfficiel('cartegrise-express.fr')).toBe(false)
  })
})

describe('prix sur la page', () => {
  it('repère un montant en euros', () => {
    expect(aUnPrixSurLaPage('Seulement 29,90 €')).toBe(true)
    expect(aUnPrixSurLaPage('Prix : 15 euros')).toBe(true)
    expect(aUnPrixSurLaPage('19.99€')).toBe(true)
  })

  it('repère les mots tarif, payer et commander', () => {
    expect(aUnPrixSurLaPage('Consultez nos tarifs')).toBe(true)
    expect(aUnPrixSurLaPage('Payez en ligne')).toBe(true)
    expect(aUnPrixSurLaPage('Commander maintenant')).toBe(true)
  })

  it('ne voit pas de prix dans un texte sans montant ni mot de paiement', () => {
    expect(aUnPrixSurLaPage('Démarche gratuite, informations utiles')).toBe(false)
  })
})

describe('liste des sites d’arnaque', () => {
  it('est livrée vide : aucune adresse inventée', () => {
    expect(SITES_ARNAQUE).toEqual([])
    expect(estSiteArnaque('exemple.com')).toBe(false)
  })

  it('reconnaît un site et ses sous-domaines quand la liste en contient', () => {
    expect(estSiteArnaque('www.site-test.example', ['site-test.example'])).toBe(true)
    expect(estSiteArnaque('autre.example', ['site-test.example'])).toBe(false)
  })
})

describe('analyse silencieuse d’une page', () => {
  it('ne fait rien sur un site officiel, même avec démarche et prix', () => {
    for (const adresse of ['https://www.service-public.fr/carte', 'https://ants.gouv.fr/', 'https://www.ameli.fr/']) {
      expect(evaluerRisque({ adresse, textePage: PAGE_CARTE_GRISE_PAYANTE }).risque).toBe(false)
    }
  })

  it('repère une page non officielle qui propose une démarche avec un montant', () => {
    const resultat = evaluerRisque({ adresse: 'https://cartegrise-express.fr/', textePage: PAGE_CARTE_GRISE_PAYANTE })
    expect(resultat).toMatchObject({ risque: true, motif: 'demarche-payante', demarche: 'Carte grise', siteOfficiel: 'ants.gouv.fr' })
  })

  it('repère une page non officielle avec une démarche et le mot « payer »', () => {
    const resultat = evaluerRisque({ adresse: 'https://exemple.com/', textePage: 'Extrait Kbis : payer par carte' })
    expect(resultat.risque).toBe(true)
  })

  it('ne repère rien sans prix ni mot de paiement', () => {
    expect(evaluerRisque({ adresse: 'https://exemple.com/', textePage: 'Informations sur la carte grise' }).risque).toBe(false)
  })

  it('reste invisible sur une page sans rapport', () => {
    const resultat = evaluerRisque({ adresse: 'https://recettes.example/', textePage: 'Tarte aux pommes à 3 € la part, commander ici' })
    expect(resultat).toEqual({ risque: false, motif: null })
  })

  it('repère un site de la liste d’arnaque même sans prix', () => {
    const resultat = evaluerRisque({
      adresse: 'https://www.site-test.example/accueil',
      textePage: 'Bienvenue',
      sitesArnaque: ['site-test.example'],
    })
    expect(resultat).toMatchObject({ risque: true, motif: 'site-arnaque' })
  })

  it('ne repère rien avec la liste d’arnaque vide et une page sans rapport', () => {
    expect(evaluerRisque({ adresse: 'https://exemple.com/', textePage: 'Bienvenue', sitesArnaque: [] }).risque).toBe(false)
  })

  it('ignore une adresse qui n’est pas une page web', () => {
    expect(evaluerRisque({ adresse: 'about:blank', textePage: PAGE_CARTE_GRISE_PAYANTE }).risque).toBe(false)
  })
})
