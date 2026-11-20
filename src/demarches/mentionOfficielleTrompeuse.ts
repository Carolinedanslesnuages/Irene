import { normaliserTexte } from './reconnaissanceDemarche'

const MENTIONS_QUI_FONT_CROIRE_A_UN_SITE_OFFICIEL = [
  /\bagree(?:e)?s?\b/,
  /\bhabilite(?:e)?s?\b/,
  /\bindependant (?:de|du) (?:l')?(?:administration|etat)\b/,
  /\btresor public\b/,
  /\bministere de l'interieur\b/,
]

/** Vrai si le texte se présente comme « agréé », « habilité » ou lié à l'État, alors que le site est privé. */
export function aUneMentionOfficielleTrompeuse(textePage: string): boolean {
  const texteNormalise = normaliserTexte(textePage)
  return MENTIONS_QUI_FONT_CROIRE_A_UN_SITE_OFFICIEL.some((mention) => mention.test(texteNormalise))
}
