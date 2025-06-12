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
          <!-- Save Star -->
          <div class="save-star" @click="toggleSaved(spot)">
            {{ isSaved(spot.idapskatespunkti) ? '⭐' : '☆' }}
          </div>

          <img
            v-if="spot.attels"
            :src="`http://localhost:3000/pictures/${spot.attels}`"
            :alt="spot.nosaukums"
            class="card-image"
          />
          <div v-else class="card-image-placeholder">Nav attēla</div>
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
const { isLoggedIn, userId } = useAuth()

const spots = ref([])
const savedIds = ref([])
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
    await fetchSavedSpots()
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

// Saved spots logic
async function fetchSavedSpots() {
  try {
    const res = await axios.get(`http://localhost:3000/api/savedspots/${userId.value}`)
    savedIds.value = res.data.map((s) => s.idapskatespunkti)
  } catch (err) {
    console.error('Kļūda ielādējot saglabātos:', err)
  }
}

function isSaved(spotId) {
  return savedIds.value.includes(spotId)
}

async function toggleSaved(spot) {
  const spotId = spot.idapskatespunkti

  if (isSaved(spotId)) {
    try {
      const savedItem = await axios.get(`http://localhost:3000/api/savedspots/${userId.value}`)
      const match = savedItem.data.find((s) => s.idapskatespunkti === spotId)
      if (match) {
        await axios.delete(`http://localhost:3000/api/savedspots/${match.idsaglabatieobjekti}`)
        savedIds.value = savedIds.value.filter((id) => id !== spotId)
      }
    } catch (err) {
      console.error('Neizdevās dzēst saglabāto:', err)
    }
  } else {
    try {
      await axios.post(`http://localhost:3000/api/savedspots`, {
        idlietotajs: userId.value,
        idapskatespunkti: spotId,
        piezimes: ''
      })
      savedIds.value.push(spotId)
    } catch (err) {
      console.error('Neizdevās saglabāt objektu:', err)
    }
  }
}
</script>

<style src="../assets/cards.css"></style>
