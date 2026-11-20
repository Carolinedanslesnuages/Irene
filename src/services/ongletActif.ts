/**
 * Nom du site de l'onglet en cours (ex. « www.monsite.fr »), ou null si le navigateur ne le donne pas
 * (aperçu hors navigateur, page interne). Accès permis par `activeTab` au clic sur l'icône.
 */
export async function lireNomDeSiteOngletActif(): Promise<string | null> {
  if (typeof chrome === 'undefined' || !chrome.tabs?.query) return null
  const [ongletActif] = await chrome.tabs.query({ active: true, currentWindow: true })
  if (!ongletActif?.url) return null
  try {
    const adresse = new URL(ongletActif.url)
    return adresse.protocol === 'http:' || adresse.protocol === 'https:' ? adresse.hostname : null
  } catch {
    return null
  }
}
