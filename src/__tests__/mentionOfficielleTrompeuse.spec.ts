import { describe, expect, it } from 'vitest'
import { evaluerRisque } from '../demarches/detectionRisque'
import { aUneMentionOfficielleTrompeuse } from '../demarches/mentionOfficielleTrompeuse'

const MENTION_AGREMENT =
  'Service carte grise agréé et habilité par le Trésor Public et le Ministère de l’Intérieur indépendant de l’Administration. Possibilité d’effectuer vos démarches d’immatriculation sur service-public.fr.'

describe('mention « agréé » en petit sur un site privé', () => {
  it('repère la démarche même sans prix', () => {
    const resultat = evaluerRisque({ adresse: 'https://cartegrise-express.fr/', textePage: MENTION_AGREMENT })
    expect(resultat).toMatchObject({ risque: true, demarche: 'Carte grise', siteOfficiel: 'ants.gouv.fr' })
  })

  it('reconnaît chaque mention trompeuse', () => {
    for (const texte of ['Site agréé', 'société habilitée', 'indépendant de l’Administration', 'Trésor Public', 'Ministère de l’Intérieur']) {
      expect(aUneMentionOfficielleTrompeuse(texte)).toBe(true)
    }
    expect(aUneMentionOfficielleTrompeuse('Informations sur la carte grise')).toBe(false)
  })

  it('ne dit rien sur un site officiel', () => {
    expect(evaluerRisque({ adresse: 'https://ants.gouv.fr/', textePage: MENTION_AGREMENT }).risque).toBe(false)
  })
})
