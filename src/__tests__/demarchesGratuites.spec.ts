import { describe, expect, it } from 'vitest'
import { DEMARCHES_GRATUITES, SITES_OFFICIELS_GRATUITS } from '../demarches/demarchesGratuites'
import { trouverDemarcheDansTexte } from '../demarches/reconnaissanceDemarche'

describe('liste des démarches gratuites', () => {
  it('donne à chaque démarche un nom et un site officiel gratuit autorisé', () => {
    expect(DEMARCHES_GRATUITES.length).toBeGreaterThan(0)
    for (const demarche of DEMARCHES_GRATUITES) {
      expect(demarche.nom.trim()).not.toBe('')
      expect(SITES_OFFICIELS_GRATUITS).toContain(demarche.siteOfficiel)
    }
  })

  it('utilise les trois sites officiels prévus', () => {
    expect([...SITES_OFFICIELS_GRATUITS].sort()).toEqual(['ants.gouv.fr', 'infogreffe.fr', 'service-public.fr'])
  })

  it('donne au moins un mot-clé à chaque démarche, sans doublon entre démarches', () => {
    const motsClesVus = new Set<string>()
    for (const demarche of DEMARCHES_GRATUITES) {
      expect(demarche.motsCles.length).toBeGreaterThan(0)
      for (const motCle of demarche.motsCles) {
        const motCleNormalise = motCle.toLowerCase()
        expect(motsClesVus.has(motCleNormalise)).toBe(false)
        motsClesVus.add(motCleNormalise)
      }
    }
  })
})

describe('reconnaissance d’une démarche dans un texte de page', () => {
  it('rattache « carte grise » à la démarche carte grise et à ants.gouv.fr', () => {
    const demarche = trouverDemarcheDansTexte('Obtenez votre CARTE GRISE en ligne en 5 minutes')
    expect(demarche?.nom).toBe('Carte grise')
    expect(demarche?.siteOfficiel).toBe('ants.gouv.fr')
  })

  it('reconnaît un mot-clé avec des accents différents', () => {
    expect(trouverDemarcheDansTexte('Extrait KBIS immédiat')?.siteOfficiel).toBe('infogreffe.fr')
    expect(trouverDemarcheDansTexte('Copie d’acte de naissance')?.siteOfficiel).toBe('service-public.fr')
  })

  it('ne reconnaît rien dans un texte sans rapport', () => {
    expect(trouverDemarcheDansTexte('Recette de la tarte aux pommes')).toBeUndefined()
  })
})
