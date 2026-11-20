import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { CLE_SITES_IGNORES, estSiteIgnore, retirerSiteIgnore, trouverSiteEntier } from '@/demarches/sitesIgnores'
import { ecrire, lire } from '@/services/stockage'
import { lireNomDeSiteOngletActif } from '@/services/ongletActif'

/** Sites pour lesquels l'usager a désactivé l'alerte, et site de l'onglet en cours. */
export const useSitesIgnoresStore = defineStore('sitesIgnores', () => {
  const sitesIgnores = ref<string[]>([])
  const siteEnCours = ref<string | null>(null)
  const charge = ref(false)

  const siteEnCoursIgnore = computed(() => siteEnCours.value !== null && estSiteIgnore(sitesIgnores.value, siteEnCours.value))

  async function charger(): Promise<void> {
    sitesIgnores.value = await lire<string[]>(CLE_SITES_IGNORES, [])
    const nomDeSite = await lireNomDeSiteOngletActif()
    siteEnCours.value = nomDeSite === null ? null : trouverSiteEntier(nomDeSite)
    charge.value = true
  }

  async function reactiver(nomDeSite: string): Promise<void> {
    sitesIgnores.value = retirerSiteIgnore(sitesIgnores.value, nomDeSite)
    await ecrire(CLE_SITES_IGNORES, sitesIgnores.value)
  }

  return { sitesIgnores, siteEnCours, siteEnCoursIgnore, charge, charger, reactiver }
})

if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(useSitesIgnoresStore, import.meta.hot))
