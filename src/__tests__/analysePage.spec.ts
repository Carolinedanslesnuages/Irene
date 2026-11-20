import { afterEach, describe, expect, it, vi } from 'vitest'
import { analyserPage, CLE_DERNIER_RISQUE } from '../contenu/analysePage'
import { CLE_SITES_IGNORES } from '../demarches/sitesIgnores'
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

  it('« Ne plus m’alerter » garde le site entier, puis n’alerte plus sur le site ni ses sous-domaines', async () => {
    const { memoire } = simulerChromeStorage()
    document.body.innerHTML = ''
    await analyserPage('https://www.cartegrise-express.fr/', 'Carte grise à 29,90 €')
    const alerte = document.body.lastElementChild?.shadowRoot
    const ignorer = [...(alerte?.querySelectorAll('button') ?? [])].find((bouton) => bouton.textContent?.startsWith('Ne plus'))
    ignorer?.click()
    await vi.waitFor(() => expect(memoire[CLE_SITES_IGNORES]).toEqual(['cartegrise-express.fr']))
    expect(document.body.children).toHaveLength(0)
    expect(await analyserPage('https://boutique.cartegrise-express.fr/', 'Carte grise à 29,90 €')).toBe(false)
    expect(document.body.children).toHaveLength(0)
  })

  it('le choix est gardé après fermeture du navigateur : le site ignoré le reste au rechargement', async () => {
    simulerChromeStorage({ [CLE_SITES_IGNORES]: ['cartegrise-express.fr'] })
    expect(await analyserPage('https://cartegrise-express.fr/', 'Carte grise à 29,90 €')).toBe(false)
    expect(document.body.children).toHaveLength(0)
  })

  it('un autre site non ignoré est toujours signalé', async () => {
    simulerChromeStorage({ [CLE_SITES_IGNORES]: ['cartegrise-express.fr'] })
    expect(await analyserPage('https://papiers-rapides.fr/', 'Carte grise à 29,90 €')).toBe(true)
    document.body.innerHTML = ''
  })

  it('Irène coupée : aucune alerte et rien de gardé, même sur une page à risque', async () => {
    const { memoire } = simulerChromeStorage({ reglages: { active: false } })
    document.body.innerHTML = ''
    expect(await analyserPage('https://cartegrise-express.fr/', 'Carte grise à 29,90 €')).toBe(false)
    expect(document.body.children).toHaveLength(0)
    expect(memoire[CLE_DERNIER_RISQUE]).toBeUndefined()
  })

  it('Irène réactivée : l’alerte revient', async () => {
    simulerChromeStorage({ reglages: { active: true } })
    expect(await analyserPage('https://cartegrise-express.fr/', 'Carte grise à 29,90 €')).toBe(true)
    document.body.innerHTML = ''
  })

  it('n’envoie rien sur le réseau pendant l’analyse', async () => {
    simulerChromeStorage()
    const envoiReseau = vi.fn<() => void>()
    vi.stubGlobal('fetch', envoiReseau)
    await analyserPage('https://cartegrise-express.fr/', 'Carte grise à 29,90 €')
    expect(envoiReseau).not.toHaveBeenCalled()
  })
})
