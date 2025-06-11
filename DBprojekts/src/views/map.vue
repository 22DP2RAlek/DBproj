<script setup>
import '../assets/map.css'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const router = useRouter()
const showPopup = ref(false)

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).href,
  iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url).href,
  shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).href,
})

onMounted(() => {
  const role = localStorage.getItem('userRole')
  if (!role) {
    showPopup.value = true
  }

  const map = L.map('map').setView([56.9496, 24.1052], 7)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map)

  const locations = [
    {
      coords: [56.946, 24.105],
      name: 'Riga',
      description: 'Capital of Latvia, beautiful old town and vibrant culture.'
    },
    {
      coords: [57.044, 24.143],
      name: 'Jurmala',
      description: 'Popular seaside resort with sandy beaches.'
    },
    {
      coords: [57.162, 24.567],
      name: 'Sigulda',
      description: 'Known for medieval castles and stunning nature.'
    }
  ]

  locations.forEach(loc => {
    L.marker(loc.coords).addTo(map)
      .bindPopup(`<b>${loc.name}</b><br>${loc.description}`)
  })
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

    <!-- Popup overlay for guests -->
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
