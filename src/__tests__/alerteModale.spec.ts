import { afterEach, describe, expect, it, vi } from 'vitest'
import { afficherAlerte } from '../contenu/alerteModale'
import { violationsAccessibilite } from './accessibilite'

const RISQUE_CARTE_GRISE = { risque: true, motif: 'demarche-payante', demarche: 'Carte grise', siteOfficiel: 'ants.gouv.fr' } as const

function lireAlerte(): ShadowRoot {
  const racine = document.body.lastElementChild?.shadowRoot
  if (!racine) throw new Error('Aucune alerte affichée')
  return racine
}

describe('alerte affichée sur une page à risque', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('affiche en grand la bonne adresse, avec un lien vers le site officiel', () => {
    afficherAlerte(document, RISQUE_CARTE_GRISE)
    const alerte = lireAlerte()
    expect(alerte.querySelector('.adresse')?.textContent).toBe('ants.gouv.fr')
    expect(alerte.querySelector('a')?.getAttribute('href')).toBe('https://ants.gouv.fr')
    expect(alerte.querySelector('h2')?.textContent).toContain('pas le site officiel')
  })

  it('ne dit jamais « gratuit » et prévient des frais de dossier possibles', () => {
    afficherAlerte(document, RISQUE_CARTE_GRISE)
    const texte = lireAlerte().querySelector('dialog')?.textContent ?? ''
    expect(texte.toLowerCase()).not.toContain('gratuit')
    expect(texte).toContain('frais de dossier')
  })

  it('est une fenêtre nommée par son titre', () => {
    afficherAlerte(document, RISQUE_CARTE_GRISE)
    expect(lireAlerte().querySelector('dialog')?.getAttribute('aria-labelledby')).toBe('irene-titre')
    expect(lireAlerte().getElementById('irene-titre')).not.toBeNull()
  })

  it('se ferme avec « Rester sur ce site »', () => {
    afficherAlerte(document, RISQUE_CARTE_GRISE)
    lireAlerte().querySelector('button')?.click()
    expect(document.body.children).toHaveLength(0)
  })

  it('donne un lien explicite vers le site officiel, sans ouvrir de nouvelle fenêtre', () => {
    afficherAlerte(document, RISQUE_CARTE_GRISE)
    const lien = lireAlerte().querySelector('a')
    expect(lien?.textContent).toBe('Aller sur le site officiel ants.gouv.fr')
    expect(lien?.hasAttribute('target')).toBe(false)
  })

  it('se ferme au clavier : le bouton est natif et la fermeture de la fenêtre retire l’alerte', () => {
    afficherAlerte(document, RISQUE_CARTE_GRISE)
    const alerte = lireAlerte()
    const fermer = alerte.querySelector('button')
    expect(fermer?.getAttribute('type')).toBe('button')
    expect(fermer?.hasAttribute('tabindex')).toBe(false)
    expect(alerte.activeElement).toBe(alerte.querySelector('a'))
    alerte.querySelector('dialog')?.dispatchEvent(new Event('close'))
    expect(document.body.children).toHaveLength(0)
  })

  it('est annoncée comme alerte et l’information est écrite, pas seulement colorée', () => {
    afficherAlerte(document, RISQUE_CARTE_GRISE)
    const fenetre = lireAlerte().querySelector('dialog')
    expect(fenetre?.getAttribute('role')).toBe('alertdialog')
    expect(fenetre?.textContent).toContain('Ce site n’est pas le site officiel')
    expect(fenetre?.textContent).toContain('ants.gouv.fr')
  })

  it('pour un site d’arnaque connu, n’affiche pas d’adresse ni de lien', () => {
    afficherAlerte(document, { risque: true, motif: 'site-arnaque' })
    expect(lireAlerte().querySelector('a')).toBeNull()
    expect(lireAlerte().querySelector('.adresse')).toBeNull()
  })

  it('propose « Ne plus m’alerter sur ce site » : un clic ignore le site et ferme l’alerte', () => {
    const ignorerCeSite = vi.fn<() => void>()
    afficherAlerte(document, RISQUE_CARTE_GRISE, ignorerCeSite)
    const boutons = [...lireAlerte().querySelectorAll('button')]
    const ignorer = boutons.find((bouton) => bouton.textContent === 'Ne plus m’alerter sur ce site')
    expect(ignorer?.getAttribute('type')).toBe('button')
    ignorer?.click()
    expect(ignorerCeSite).toHaveBeenCalledTimes(1)
    expect(document.body.children).toHaveLength(0)
  })

  it('n’a aucune violation d’accessibilité avec le bouton pour ignorer le site', async () => {
    afficherAlerte(document, RISQUE_CARTE_GRISE, () => undefined)
    expect(await violationsAccessibilite(lireAlerte().querySelector('dialog') as Element)).toEqual([])
  })

  it('n’a aucune violation d’accessibilité détectable', async () => {
    afficherAlerte(document, RISQUE_CARTE_GRISE)
    expect(await violationsAccessibilite(lireAlerte().querySelector('dialog') as Element)).toEqual([])
  })
})
