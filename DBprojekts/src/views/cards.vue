<template>
  <div class="cards-page-wrapper">
    <h1 class="page-title">Apskates objekti</h1>
    <p class="page-subtitle">
      Šeit vari apskatīt dažādus interesantus apskates objektus Latvijā.
      Lai piekļūtu šai sadaļai, jābūt pieslēgtam lietotājam.
    </p>

    <!-- Popup if not logged in -->
    <div v-if="showPopup" class="popup-overlay">
      <div class="popup-content">
        <h2>Lūdzu, pieslēdzieties vai reģistrējieties</h2>
        <p>Lai skatītu apskates objektus, jums jābūt pieslēgtam lietotājam.</p>
        <div class="popup-buttons">
          <button @click="goToLogin">Pieslēgties</button>
          <button @click="goToRegister">Reģistrēties</button>
        </div>
      </div>
    </div>

    <!-- Cards content -->
    <div v-if="!showPopup">
      <div v-if="loading" class="loading">Ielādē datus...</div>
      <div v-if="error" class="error">{{ error }}</div>

      <div v-if="!loading && !error" class="card-container">
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
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { isLoggedIn } = useAuth()

const spots = ref([])
const loading = ref(true)
const error = ref(null)
const showPopup = ref(false)

onMounted(async () => {
  if (!isLoggedIn.value) {
    showPopup.value = true
    loading.value = false
    return
  }

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

function goToLogin() {
  router.push('/login')
}

function goToRegister() {
  router.push('/register')
}
</script>

<style src="../assets/cards.css"></style>
