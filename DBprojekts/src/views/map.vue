<script setup>
import '../assets/map.css'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import axios from 'axios'

const router = useRouter()
const showPopup = ref(false)

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).href,
  iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url).href,
  shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).href,
})

onMounted(async () => {
  const role = localStorage.getItem('userRole')
  if (!role) {
    showPopup.value = true
  }

  const map = L.map('map').setView([56.9496, 24.1052], 7)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map)

  if (role) {
    try {
      const response = await axios.get('http://localhost:3000/api/apskatespunkti')
      console.log('Apskatespunkti data:', response.data) // Debug

      response.data.forEach(loc => {
        if (loc.koord_x && loc.koord_y) {
          L.marker([loc.koord_x, loc.koord_y]).addTo(map)
            .bindPopup(
              `<b>${loc.nosaukums}</b><br>` +
              `<i>${loc.darba_laiks || 'No working hours info'}</i><br>` +
              `${loc.apraksts || 'No description'}<br>` +
              `<small>${loc.adrese || ''}</small>`
            )
        }
      })
    } catch (error) {
      console.error('Error fetching apskatespunkti:', error)
    }
  }
})

function goToLogin() {
  router.push('/login')
}

function goToRegister() {
  router.push('/register')
}
</script>

<template>
  <div class="map-wrapper">
    <div id="map"></div>

    <div v-if="showPopup" class="popup-overlay">
      <div class="popup-content">
        <h2>Please Login or Register</h2>
        <p>You need an account to view full map details.</p>
        <div class="popup-buttons">
          <button @click="goToLogin">Login</button>
          <button @click="goToRegister">Register</button>
        </div>
      </div>
    </div>
  </div>
</template>
