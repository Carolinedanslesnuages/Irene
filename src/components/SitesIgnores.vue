<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useSitesIgnoresStore } from '@/stores/sitesIgnores'

const magasin = useSitesIgnoresStore()
const { sitesIgnores, siteEnCours, siteEnCoursIgnore } = storeToRefs(magasin)
const annonce = ref('')
const erreur = ref('')

async function reactiver(nomDeSite: string): Promise<void> {
  erreur.value = ''
  try {
    await magasin.reactiver(nomDeSite)
    annonce.value = `Alerte réactivée pour ${nomDeSite}.`
  } catch {
    erreur.value = 'Le changement n’a pas pu être enregistré. Réessayez.'
  }
}
</script>

<template>
  <section aria-labelledby="titre-sites-ignores">
    <h2 id="titre-sites-ignores">Sites ignorés</h2>
    <p v-if="siteEnCours" class="site-en-cours">
      <template v-if="siteEnCoursIgnore">
        L’alerte est désactivée pour le site en cours : <strong>{{ siteEnCours }}</strong>.
        <button type="button" @click="reactiver(siteEnCours)">Réactiver l’alerte pour {{ siteEnCours }}</button>
      </template>
      <template v-else>L’alerte est active pour le site en cours : <strong>{{ siteEnCours }}</strong>.</template>
    </p>
    <p v-if="sitesIgnores.length === 0" class="aide">Aucun site ignoré pour le moment.</p>
    <ul v-else class="liste-sites">
      <li v-for="nomDeSite in sitesIgnores" :key="nomDeSite">
        <span>{{ nomDeSite }}</span>
        <button type="button" @click="reactiver(nomDeSite)">Réactiver l’alerte pour {{ nomDeSite }}</button>
      </li>
    </ul>
    <p role="status" class="message-succes">{{ annonce }}</p>
    <p v-if="erreur" role="alert" class="message-erreur">{{ erreur }}</p>
  </section>
</template>
