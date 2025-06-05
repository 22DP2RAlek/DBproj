<script setup>
import '../assets/map.css';
import { onMounted } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for default marker icons in some build setups
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).href,
  iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url).href,
  shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).href,
})

onMounted(() => {
  const map = L.map('map').setView([56.9496, 24.1052], 7) // Center on Latvia

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map)

  // Example pins with popups
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
</script>

<template>
  <div id="map" style="height: 600px;"></div>
</template>

<style scoped>
/* Optional: ensure the map container fills the width */
#map {
  width: 100%;
}
</style>
