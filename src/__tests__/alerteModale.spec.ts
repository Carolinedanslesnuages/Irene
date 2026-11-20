import { afterEach, describe, expect, it } from 'vitest'
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

  it('pour un site d’arnaque connu, n’affiche pas d’adresse ni de lien', () => {
    afficherAlerte(document, { risque: true, motif: 'site-arnaque' })
    expect(lireAlerte().querySelector('a')).toBeNull()
    expect(lireAlerte().querySelector('.adresse')).toBeNull()
  })

  it('n’a aucune violation d’accessibilité détectable', async () => {
    afficherAlerte(document, RISQUE_CARTE_GRISE)
    expect(await violationsAccessibilite(lireAlerte().querySelector('dialog') as Element)).toEqual([])
  })
})
