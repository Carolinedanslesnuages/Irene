import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import App from '@/App.vue'
import { violationsAccessibilite } from './accessibilite'
import { simulerChromeStorage } from './donnees'

const monter = async () => {
  const wrapper = mount(App, { attachTo: document.body })
  await flushPromises()
  return wrapper
}

describe('Fenêtre de l’extension', () => {
  beforeEach(() => setActivePinia(createPinia()))
  afterEach(() => {
    vi.unstubAllGlobals()
    document.body.innerHTML = ''
  })

  it('affiche le nom de l’extension et son réglage d’activation', async () => {
    simulerChromeStorage({ reglages: { active: false } })
    const wrapper = await monter()
    expect(wrapper.find('h1').text()).toBe('Irène')
    expect((wrapper.find('#activation').element as HTMLInputElement).checked).toBe(false)
    wrapper.unmount()
  })

  it('enregistre le changement et l’annonce', async () => {
    const { memoire } = simulerChromeStorage()
    const wrapper = await monter()
    await wrapper.find('#activation').setValue(false)
    await flushPromises()
    expect(memoire).toEqual({ reglages: { active: false } })
    expect(wrapper.find('[role="status"]').text()).toBe('Irène est coupée')
    wrapper.unmount()
  })

  it('affiche en texte si Irène est active ou coupée', async () => {
    simulerChromeStorage()
    const wrapper = await monter()
    expect(wrapper.find('[role="status"]').text()).toBe('Irène est active')
    await wrapper.find('#activation').setValue(false)
    expect(wrapper.find('[role="status"]').text()).toBe('Irène est coupée')
    await wrapper.find('#activation').setValue(true)
    expect(wrapper.find('[role="status"]').text()).toBe('Irène est active')
    wrapper.unmount()
  })

  it('garde le réglage : coupée puis fenêtre rouverte, Irène est toujours coupée', async () => {
    const { memoire } = simulerChromeStorage()
    const premiere = await monter()
    await premiere.find('#activation').setValue(false)
    await flushPromises()
    premiere.unmount()
    setActivePinia(createPinia())
    simulerChromeStorage(memoire)
    const reouverte = await monter()
    expect(reouverte.find('[role="status"]').text()).toBe('Irène est coupée')
    expect((reouverte.find('#activation').element as HTMLInputElement).checked).toBe(false)
    reouverte.unmount()
  })

  it('prévient quand l’enregistrement échoue', async () => {
    const { local } = simulerChromeStorage()
    local.set.mockRejectedValueOnce(new Error('quota'))
    const wrapper = await monter()
    await wrapper.find('#activation').setValue(false)
    await flushPromises()
    expect(wrapper.find('[role="alert"]').text()).toContain('n’a pas pu être enregistré')
    wrapper.unmount()
  })

  it('aucune identité de l’État : ni Marianne, ni « République française »', async () => {
    simulerChromeStorage()
    const wrapper = await monter()
    expect(wrapper.html()).not.toMatch(/Marianne|République|fr-header/i)
    wrapper.unmount()
  })

  it('aucune violation d’accessibilité automatique', async () => {
    simulerChromeStorage()
    const wrapper = await monter()
    expect(await violationsAccessibilite(document.body)).toEqual([])
    wrapper.unmount()
  })
})
