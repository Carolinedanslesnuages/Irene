/**
 * Script de contenu : lit le texte de la page consultée, en silence, et n'envoie rien hors du
 * navigateur. Sur une page sans risque, il ne la modifie jamais. Sur une page à risque, il garde
 * seulement le nom du site et le motif dans le stockage, puis affiche une grande fenêtre d'alerte
 * avec l'adresse du site officiel.
 */
import { afficherAlerte } from './alerteModale'
import { evaluerRisque } from '../demarches/detectionRisque'

export const CLE_DERNIER_RISQUE = 'dernierRisque'

export async function analyserPage(adresse: string, textePage: string): Promise<boolean> {
  const resultat = evaluerRisque({ adresse, textePage })
  if (!resultat.risque) return false
  // Accès direct : un script de contenu est un fichier seul, il ne peut pas charger de module partagé.
  await chrome.storage.local.set({ [CLE_DERNIER_RISQUE]: { nomDeSite: new URL(adresse).hostname, ...resultat } })
  afficherAlerte(document, resultat)
  return true
}

if (typeof document !== 'undefined' && typeof chrome !== 'undefined' && chrome.runtime?.id) {
  void analyserPage(window.location.href, document.body?.innerText ?? document.body?.textContent ?? '')
}
