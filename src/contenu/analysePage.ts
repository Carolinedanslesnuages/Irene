/**
 * Script de contenu : lit le texte de la page consultée, en silence, et n'envoie rien hors du
 * navigateur. Sur une page sans risque, il ne la modifie jamais. Sur une page à risque, il garde
 * seulement le nom du site et le motif dans le stockage, puis affiche une grande fenêtre d'alerte
 * avec l'adresse du site officiel.
 */
import { afficherAlerte } from './alerteModale'
import { evaluerRisque } from '../demarches/detectionRisque'
import { ajouterSiteIgnore, CLE_SITES_IGNORES, estSiteIgnore } from '../demarches/sitesIgnores?autonome'

export const CLE_DERNIER_RISQUE = 'dernierRisque'

/** Irène est active par défaut : seul un réglage explicitement coupé arrête l'analyse. */
async function ireneEstActive(): Promise<boolean> {
  const stockage = await chrome.storage.local.get('reglages')
  const reglages = stockage.reglages as { active?: boolean } | undefined
  return reglages?.active !== false
}

async function lireSitesIgnores(): Promise<string[]> {
  const stockage = await chrome.storage.local.get(CLE_SITES_IGNORES)
  return (stockage[CLE_SITES_IGNORES] as string[] | undefined) ?? []
}

async function ignorerSite(nomDeSite: string): Promise<void> {
  await chrome.storage.local.set({ [CLE_SITES_IGNORES]: ajouterSiteIgnore(await lireSitesIgnores(), nomDeSite) })
}

export async function analyserPage(adresse: string, textePage: string): Promise<boolean> {
  if (!(await ireneEstActive())) return false
  const nomDeSite = new URL(adresse).hostname
  if (estSiteIgnore(await lireSitesIgnores(), nomDeSite)) return false
  const resultat = evaluerRisque({ adresse, textePage })
  if (!resultat.risque) return false
  // Accès direct : un script de contenu est un fichier seul, il ne peut pas charger de module partagé.
  await chrome.storage.local.set({ [CLE_DERNIER_RISQUE]: { nomDeSite, ...resultat } })
  afficherAlerte(document, resultat, () => void ignorerSite(nomDeSite))
  return true
}

if (typeof document !== 'undefined' && typeof chrome !== 'undefined' && chrome.runtime?.id) {
  void analyserPage(window.location.href, document.body?.innerText ?? document.body?.textContent ?? '')
}
