<script setup>
import '../assets/map.css'
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import axios from 'axios'

const router = useRouter()
const route = useRoute()
const showPopup = ref(false)

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).href,
  iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url).href,
  shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).href,
})

let map // leaflet map instance
const markers = ref([]) // will hold { id, marker } objects

function goToLogin() {
  router.push('/login')
}

function goToRegister() {
  router.push('/register')
}

// Open popup for the marker matching spotId and center map there
function activatePin(spotId) {
  const entry = markers.value.find(m => m.id === spotId)
  if (entry) {
    entry.marker.openPopup()
    map.setView(entry.marker.getLatLng(), 13, { animate: true })
  }
}

onMounted(async () => {
  const role = localStorage.getItem('userRole')
  if (!role) {
    showPopup.value = true
    return
  }

  // Initialize map centered on Latvia
  map = L.map('map').setView([56.9496, 24.1052], 7)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map)

  try {
    const response = await axios.get('http://localhost:3000/api/apskatespunkti')
    // Add markers to map and store references
    response.data.forEach(loc => {
      if (loc.koord_x && loc.koord_y) {
        const marker = L.marker([loc.koord_x, loc.koord_y]).addTo(map)
          .bindPopup(
            `<b>${loc.nosaukums}</b><br>` +
            `<i>${loc.darba_laiks || 'No working hours info'}</i><br>` +
            `${loc.apraksts || 'No description'}<br>` +
            `<small>${loc.adrese || ''}</small>`
          )
        markers.value.push({ id: loc.idapskatespunkti, marker })
      }
    })

    // If a spotId query param exists, activate the corresponding pin
    if (route.query.spotId) {
      activatePin(Number(route.query.spotId))
    }
  } catch (error) {
    console.error('Error fetching apskatespunkti:', error)
  }
})

// Watch for route changes (if user navigates with a new spotId param)
watch(() => route.query.spotId, (newSpotId) => {
  if (newSpotId && markers.value.length) {
    activatePin(Number(newSpotId))
  }
})
</script>

<template>
  <div class="map-wrapper">
    <div id="map" style="height: 100vh;"></div>

    <div v-if="showPopup" class="popup-overlay">
      <div class="popup-content">
        <h2>Lūdzu, pieslēdzieties vai reģistrējieties</h2>
        <p>Lai skatītu pilnu kartes saturu, jums jābūt reģistrētam lietotājam.</p>
        <div class="popup-buttons">
          <button @click="goToLogin">Pieslēgties</button>
          <button @click="goToRegister">Reģistrēties</button>
        </div>
      </div>
    </div>
  </div>
</template>
