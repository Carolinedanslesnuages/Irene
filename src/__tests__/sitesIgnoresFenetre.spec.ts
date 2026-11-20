import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import App from '@/App.vue'
import { violationsAccessibilite } from './accessibilite'
import { simulerChromeStorage } from './donnees'

function simulerOngletActif(adresse: string): void {
  const chromeActuel = (globalThis as unknown as { chrome: object }).chrome
  vi.stubGlobal('chrome', { ...chromeActuel, tabs: { query: vi.fn<() => Promise<{ url: string }[]>>(async () => [{ url: adresse }]) } })
}

const monter = async () => {
  const wrapper = mount(App, { attachTo: document.body })
  await flushPromises()
  return wrapper
}

const trouverBouton = (wrapper: Awaited<ReturnType<typeof monter>>, intitule: string) =>
  wrapper.findAll('button').find((bouton) => bouton.text() === intitule)

describe('Fenêtre de l’extension : sites ignorés', () => {
  beforeEach(() => setActivePinia(createPinia()))
  afterEach(() => {
    vi.unstubAllGlobals()
    document.body.innerHTML = ''
  })

  it('dit quand la liste est vide', async () => {
    simulerChromeStorage()
    const wrapper = await monter()
    expect(wrapper.text()).toContain('Aucun site ignoré pour le moment.')
    expect(wrapper.find('h2').text()).toBe('Sites ignorés')
    wrapper.unmount()
  })

  it('liste les sites gardés (même après fermeture du navigateur), un bouton nommé par site', async () => {
    simulerChromeStorage({ sitesIgnores: ['monsite.fr', 'autre.co.uk'] })
    const wrapper = await monter()
    expect(wrapper.findAll('li').map((ligne) => ligne.find('span').text())).toEqual(['monsite.fr', 'autre.co.uk'])
    expect(trouverBouton(wrapper, 'Réactiver l’alerte pour autre.co.uk')).toBeDefined()
    wrapper.unmount()
  })

  it('réactive l’alerte depuis la liste, l’annonce et l’enregistre', async () => {
    const { memoire } = simulerChromeStorage({ sitesIgnores: ['monsite.fr', 'autre.fr'] })
    const wrapper = await monter()
    await trouverBouton(wrapper, 'Réactiver l’alerte pour monsite.fr')?.trigger('click')
    await flushPromises()
    expect(memoire.sitesIgnores).toEqual(['autre.fr'])
    expect(wrapper.findAll('li')).toHaveLength(1)
    expect(wrapper.text()).toContain('Alerte réactivée pour monsite.fr.')
    wrapper.unmount()
  })

  it('indique si le site en cours est ignoré et le réactive depuis là', async () => {
    const { memoire } = simulerChromeStorage({ sitesIgnores: ['monsite.fr'] })
    simulerOngletActif('https://www.monsite.fr/commande')
    const wrapper = await monter()
    expect(wrapper.find('.site-en-cours').text()).toContain('désactivée pour le site en cours : monsite.fr')
    await wrapper.find('.site-en-cours button').trigger('click')
    await flushPromises()
    expect(memoire.sitesIgnores).toEqual([])
    expect(wrapper.find('.site-en-cours').text()).toContain('active pour le site en cours')
    wrapper.unmount()
  })

  it('prévient quand l’enregistrement échoue', async () => {
    const { local } = simulerChromeStorage({ sitesIgnores: ['monsite.fr'] })
    local.set.mockRejectedValueOnce(new Error('quota'))
    const wrapper = await monter()
    await trouverBouton(wrapper, 'Réactiver l’alerte pour monsite.fr')?.trigger('click')
    await flushPromises()
    expect(wrapper.find('[role="alert"]').text()).toContain('n’a pas pu être enregistré')
    wrapper.unmount()
  })

  it('aucune violation d’accessibilité automatique, avec liste et site en cours', async () => {
    simulerChromeStorage({ sitesIgnores: ['monsite.fr'] })
    simulerOngletActif('https://monsite.fr/')
    const wrapper = await monter()
    expect(await violationsAccessibilite(document.body)).toEqual([])
    wrapper.unmount()
  })
})
