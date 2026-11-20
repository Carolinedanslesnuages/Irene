import { afterEach, describe, expect, it, vi } from 'vitest'
import { analyserPage, CLE_DERNIER_RISQUE } from '../contenu/analysePage'
import { simulerChromeStorage } from './donnees'

describe('script de contenu : analyse silencieuse', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('sur un site officiel, ne garde rien', async () => {
    const { memoire } = simulerChromeStorage()
    expect(await analyserPage('https://ants.gouv.fr/carte-grise', 'Carte grise : payer en ligne 29,90 €')).toBe(false)
    expect(memoire).toEqual({})
  })

  it('sur une page sans rapport, ne garde rien et ne modifie pas la page', async () => {
    const { memoire } = simulerChromeStorage()
    document.body.innerHTML = '<p>Recette de tarte à 3 €</p>'
    const pageAvant = document.body.innerHTML
    expect(await analyserPage('https://recettes.example/', document.body.textContent ?? '')).toBe(false)
    expect(memoire).toEqual({})
    expect(document.body.innerHTML).toBe(pageAvant)
  })

  it('sur une page non officielle avec démarche et prix, garde le site et le motif seulement', async () => {
    const { memoire } = simulerChromeStorage()
    expect(await analyserPage('https://cartegrise-express.fr/commande?nom=secret', 'Carte grise à 29,90 €')).toBe(true)
    expect(memoire[CLE_DERNIER_RISQUE]).toEqual({
      nomDeSite: 'cartegrise-express.fr',
      risque: true,
      motif: 'demarche-payante',
      demarche: 'Carte grise',
      siteOfficiel: 'ants.gouv.fr',
    })
    expect(JSON.stringify(memoire)).not.toContain('secret')
  })

  it('n’envoie rien sur le réseau pendant l’analyse', async () => {
    simulerChromeStorage()
    const envoiReseau = vi.fn<() => void>()
    vi.stubGlobal('fetch', envoiReseau)
    await analyserPage('https://cartegrise-express.fr/', 'Carte grise à 29,90 €')
    expect(envoiReseau).not.toHaveBeenCalled()
  })
})
