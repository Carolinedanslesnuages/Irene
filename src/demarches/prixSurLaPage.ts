const MONTANT_EN_EUROS = /\d+(?:[.,]\d{1,2})?\s?(?:€|euros?\b)/i
const MOTS_DE_PAIEMENT = /\b(?:tarifs?|payer|payez|commander|commandez)\b/i

/** Un « prix » : un montant en euros, ou les mots tarif, payer, commander. */
export function aUnPrixSurLaPage(textePage: string): boolean {
  return MONTANT_EN_EUROS.test(textePage) || MOTS_DE_PAIEMENT.test(textePage)
}
