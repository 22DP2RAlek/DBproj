<template>
  <div class="card-container">
    <h1>Apskates objekti</h1>
    <div v-if="loading">Ielādē datus...</div>
    <div v-if="error" class="error">{{ error }}</div>

    <div class="card" v-for="spot in spots" :key="spot.idapskatespunkti">
      <img
        v-if="spot.attels"
        :src="`/pictures/${spot.attels}`"
        :alt="spot.nosaukums"
      />
      <div class="card-content">
        <h3>{{ spot.nosaukums }}</h3>
        <p><strong>Darba laiks:</strong> {{ spot.darba_laiks || 'Nav informācijas' }}</p>
        <p>{{ spot.apraksts || 'Nav apraksta' }}</p>
        <p><strong>Adrese:</strong> {{ spot.adrese || 'Nav adreses' }}</p>
        <button @click="goToMap(spot)">Apskatīt kartē</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const spots = ref([])
const loading = ref(true)
const error = ref(null)
const router = useRouter()

onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/apskatespunkti')
    spots.value = response.data
  } catch (err) {
    error.value = 'Neizdevās ielādēt datus.'
    console.error(err)
  } finally {
    loading.value = false
  }
})

function goToMap(spot) {
  router.push({ name: 'map', query: { spotId: spot.idapskatespunkti } })
}
</script>

<style src="../assets/cards.css"></style>
