import { describe, expect, it } from 'vitest'
import { extraireSitesDeLaListeNoire } from '../demarches/extraireSitesDeLaListeNoire'

const EN_TETE = '"nom";"categorie";"date_inscription"'

describe('extraction des sites de la liste noire', () => {
  it('garde les noms de site et ignore l’en-tête et la marque d’octets', () => {
    const csv = `﻿${EN_TETE}\n"tr-brokers.com";"Usurpation";"2026-11-12"`
    expect(extraireSitesDeLaListeNoire(csv)).toEqual(['tr-brokers.com'])
  })

  it('retient le site d’un courriel et retire « www. »', () => {
    const csv = `${EN_TETE}\n"hsbc@clients-group.com";"Usurpation";"2026-11-12"\n"www.armen.ltd";"Usurpation";"2026-10-08"`
    expect(extraireSitesDeLaListeNoire(csv)).toEqual(['armen.ltd', 'clients-group.com'])
  })

  it('supprime les doublons et ignore les lignes qui ne sont pas un site', () => {
    const csv = `${EN_TETE}\n"a.com";"x";"d"\n"contact@a.com";"x";"d"\n"Société Dupont";"x";"d"\n`
    expect(extraireSitesDeLaListeNoire(csv)).toEqual(['a.com'])
  })
})
