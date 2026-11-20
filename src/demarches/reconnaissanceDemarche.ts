import { DEMARCHES_GRATUITES, type DemarcheGratuite } from './demarchesGratuites'

export function normaliserTexte(texte: string): string {
  return texte
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[’`]/g, "'")
}

export function trouverDemarcheDansTexte(textePage: string): DemarcheGratuite | undefined {
  const texteNormalise = normaliserTexte(textePage)
  return DEMARCHES_GRATUITES.find((demarche) =>
    demarche.motsCles.some((motCle) => texteNormalise.includes(normaliserTexte(motCle))),
  )
}
