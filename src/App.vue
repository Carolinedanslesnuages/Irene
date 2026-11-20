<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import SitesIgnores from '@/components/SitesIgnores.vue'
import { useReglagesStore } from '@/stores/reglages'
import { useSitesIgnoresStore } from '@/stores/sitesIgnores'

const magasin = useReglagesStore()
const magasinSitesIgnores = useSitesIgnoresStore()
const { reglages, charge } = storeToRefs(magasin)
const erreur = ref('')

onMounted(async () => {
  await Promise.all([magasin.charger(), magasinSitesIgnores.charger()])
})

async function basculer(evenement: Event): Promise<void> {
  const active = (evenement.target as HTMLInputElement).checked
  erreur.value = ''
  try {
    await magasin.changerActivation(active)
  } catch {
    erreur.value = 'Le réglage n’a pas pu être enregistré. Réessayez.'
  }
}
</script>

<template>
  <main>
    <h1>Irène</h1>
    <p class="aide">Le lanceur d’alerte de vos démarches en ligne.</p>
    <p v-if="!charge" role="status">Chargement…</p>
    <template v-else>
      <div class="choix">
        <input id="activation" type="checkbox" :checked="reglages.active" @change="basculer" />
        <label for="activation">
          Activer Irène
          <span class="aide"> — coupée, elle n’affiche aucune alerte.</span>
        </label>
      </div>
      <p role="status" class="message-succes">{{ reglages.active ? 'Irène est active' : 'Irène est coupée' }}</p>
    </template>
    <p v-if="erreur" role="alert" class="message-erreur">{{ erreur }}</p>
    <SitesIgnores v-if="charge" />
  </main>
</template>
