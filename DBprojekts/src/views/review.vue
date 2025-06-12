<template>
  <div class="atsauksmes-wrapper">
    <h1>Atsauksmes par apskates objektiem</h1>

    <div class="dropdown-section">
      <label for="spotSelector">Izvēlies apskates objektu:</label>
      <select id="spotSelector" v-model="selectedSpotId">
        <option disabled value="">-- Izvēlies --</option>
        <option v-for="spot in spots" :key="spot.idapskatespunkti" :value="spot.idapskatespunkti">
          {{ spot.nosaukums }}
        </option>
      </select>
    </div>

    <div v-if="selectedSpotId" class="review-form">
      <h2>Uzraksti atsauksmi</h2>

      <label>Vērtējums:</label>
      <select v-model="newReview.vertejums" :disabled="!isLoggedIn">
        <option disabled value="">-- Izvēlies zvaigznes --</option>
        <option v-for="n in 5" :key="n" :value="n">{{ n }} ★</option>
      </select>

      <label>Komentārs:</label>
      <textarea v-model="newReview.komentars" placeholder="Tavs komentārs..." :disabled="!isLoggedIn"></textarea>

      <button :disabled="!isLoggedIn" @click="submitReview">Iesniegt atsauksmi</button>

      <p v-if="!isLoggedIn" class="login-warning">Jums jāpiesakās, lai iesniegtu atsauksmi.</p>
    </div>

    <div v-if="reviews.length" class="review-list">
      <h2>Esošās atsauksmes</h2>
      <div v-for="review in reviews" :key="review.idatsauksmes" class="review-item">
        <div class="review-header">
          <strong>{{ review.vards || 'Anonīms' }}</strong>
          <span class="stars">{{ '★'.repeat(review.vertejums) }}</span>
          <button
            v-if="isAdmin"
            class="delete-button"
            @click="deleteReview(review.idatsauksmes)"
          >
            Dzēst
          </button>
        </div>
        <p>{{ review.komentars }}</p>
        <small>{{ formatDate(review.izveidosanas_laiks) }}</small>
      </div>
    </div>

    <div v-else-if="selectedSpotId && !loading">
      <p>Nav atsauksmju par šo objektu.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import axios from 'axios'
import { useRoute } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import '../assets/review.css'

const { isLoggedIn, userId, userRole } = useAuth()

const isAdmin = userRole.value === '2' || userRole.value === 2
const route = useRoute()
const selectedSpotId = ref(route.query.spotId || '')
const spots = ref([])
const reviews = ref([])
const newReview = ref({ vertejums: '', komentars: '' })
const loading = ref(false)

onMounted(async () => {
  await fetchSpots()
  if (selectedSpotId.value) await fetchReviews(selectedSpotId.value)
})

watch(selectedSpotId, async (newId) => {
  if (newId) {
    newReview.value = { vertejums: '', komentars: '' }
    await fetchReviews(newId)
  }
})

async function fetchSpots() {
  try {
    const res = await axios.get('http://localhost:3000/api/apskatespunkti')
    spots.value = res.data
  } catch (error) {
    console.error('Kļūda ielādējot apskates punktus:', error)
  }
}

async function fetchReviews(spotId) {
  loading.value = true
  try {
    const res = await axios.get(`http://localhost:3000/api/atsauksmes/${spotId}`)
    reviews.value = res.data
  } catch (err) {
    console.error('Kļūda ielādējot atsauksmes:', err)
  } finally {
    loading.value = false
  }
}

async function submitReview() {
  if (!newReview.value.vertejums || !newReview.value.komentars) {
    alert('Lūdzu, aizpildi gan vērtējumu, gan komentāru.')
    return
  }

  try {
    await axios.post('http://localhost:3000/api/atsauksmes', {
      vertejums: newReview.value.vertejums,
      komentars: newReview.value.komentars,
      idlietotajs: userId.value,
      idapskatespunkti: selectedSpotId.value
    })

    newReview.value = { vertejums: '', komentars: '' }
    await fetchReviews(selectedSpotId.value)
    alert('Atsauksme pievienota!')
  } catch (err) {
    console.error('Neizdevās saglabāt atsauksmi:', err)
    alert('Radās problēmas saglabājot atsauksmi.')
  }
}

async function deleteReview(idatsauksmes) {
  if (!confirm('Vai tiešām vēlies dzēst šo atsauksmi?')) return

  try {
    await axios.delete(`http://localhost:3000/api/atsauksmes/${idatsauksmes}`, {
      data: { idlietotajs: userId.value, idlomas: parseInt(userRole.value) }
    })
    await fetchReviews(selectedSpotId.value)
    alert('Atsauksme dzēsta.')
  } catch (err) {
    console.error('Kļūda dzēšot atsauksmi:', err)
    alert('Neizdevās dzēst atsauksmi.')
  }
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleString('lv-LV')
}
</script>
