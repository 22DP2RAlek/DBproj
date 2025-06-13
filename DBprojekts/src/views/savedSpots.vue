<template>
  <div class="saved-spots-wrapper">
    <h1>Saglabātie objekti</h1>

    <div class="dropdown-section">
      <label for="savedSelector">Izvēlies saglabāto objektu:</label>
      <select id="savedSelector" v-model="selectedSavedId">
        <option disabled value="">-- Izvēlies --</option>
        <option
          v-for="spot in savedSpots"
          :key="spot.idsaglabatieobjekti"
          :value="spot.idsaglabatieobjekti"
        >
          {{ spot.apskatespunkts?.nosaukums || 'Nepilnīgi dati' }}
        </option>
      </select>
    </div>

    <div v-if="selectedSpot" class="saved-content-section">
      <!-- Left: Card -->
      <div class="card">
        <img
          v-if="selectedSpot.apskatespunkts?.attels"
          :src="`http://localhost:3000/pictures/${selectedSpot.apskatespunkts.attels}`"
          :alt="selectedSpot.apskatespunkts.nosaukums"
          class="card-image"
        />
        <div v-else class="card-image-placeholder">Nav attēla</div>
        <div class="card-content">
          <h3>{{ selectedSpot.apskatespunkts.nosaukums }}</h3>
          <p><strong>Darba laiks:</strong> {{ selectedSpot.apskatespunkts.darba_laiks || 'Nav informācijas' }}</p>
          <p>{{ selectedSpot.apskatespunkts.apraksts || 'Nav apraksta' }}</p>
          <p><strong>Adrese:</strong> {{ selectedSpot.apskatespunkts.adrese || 'Nav adreses' }}</p>
          <button class="delete-button" @click="deleteSavedSpot(selectedSpot.idsaglabatieobjekti)">
            Dzēst saglabāto
          </button>
        </div>
      </div>

      <!-- Right: Note Section -->
      <div class="note-section">
        <h3>Tava piezīme</h3>
        <div v-if="!editing">
          <p v-if="note">{{ note }}</p>
          <p v-else class="empty-note">Nav piezīmes.</p>
          <button @click="startEdit" v-if="note">Rediģēt</button>
          <button @click="startEdit" v-else>Pievienot piezīmi</button>
        </div>

        <div v-else>
          <textarea
            v-model="noteDraft"
            rows="8"
            placeholder="Rakstiet savu piezīmi šeit..."
          ></textarea>
          <div class="note-buttons">
            <button @click="saveNote">Saglabāt</button>
            <button @click="cancelEdit">Atcelt</button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="statusMessage" :class="['status-message', { error: isError }]">
      {{ statusMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import axios from 'axios'
import { useAuth } from '@/composables/useAuth'
import '../assets/savedSpots.css'

const { userId } = useAuth()
const savedSpots = ref([])
const selectedSavedId = ref('')
const statusMessage = ref('')
const isError = ref(false)

const editing = ref(false)
const note = ref('')
const noteDraft = ref('')

onMounted(() => {
  fetchSavedSpots()
})

const selectedSpot = computed(() =>
  savedSpots.value.find((s) => s.idsaglabatieobjekti === selectedSavedId.value)
)

watch(selectedSpot, (newSpot) => {
  if (newSpot) {
    note.value = newSpot.piezimes || ''
    editing.value = false
    noteDraft.value = note.value
  }
})

async function fetchSavedSpots() {
  try {
    const res = await axios.get(`http://localhost:3000/api/savedspots/${userId.value}`)
    savedSpots.value = res.data
  } catch (err) {
    console.error('Neizdevās ielādēt saglabātos:', err)
  }
}

async function deleteSavedSpot(id) {
  try {
    await axios.delete(`http://localhost:3000/api/savedspots/${id}`)
    savedSpots.value = savedSpots.value.filter((s) => s.idsaglabatieobjekti !== id)
    selectedSavedId.value = ''
    statusMessage.value = 'Objekts dzēsts no saglabātajiem.'
    isError.value = false
  } catch (err) {
    console.error('Kļūda dzēšot saglabāto objektu:', err)
    statusMessage.value = 'Neizdevās dzēst objektu.'
    isError.value = true
  }
  setTimeout(() => {
    statusMessage.value = ''
  }, 3000)
}

function startEdit() {
  editing.value = true
  noteDraft.value = note.value
}

function cancelEdit() {
  editing.value = false
  noteDraft.value = note.value
}

async function saveNote() {
  if (!noteDraft.value.trim()) {
    alert('Piezīme nevar būt tukša')
    return
  }

  try {
    const response = await axios.put(
      `http://localhost:3000/api/savedspots/${selectedSavedId.value}`, // <-- fixed URL here
      { piezimes: noteDraft.value.trim() }
    )
    if (response.data.success) {
      note.value = noteDraft.value.trim()

      const index = savedSpots.value.findIndex(s => s.idsaglabatieobjekti === selectedSavedId.value)
      if (index !== -1) {
        savedSpots.value[index].piezimes = note.value
      }

      editing.value = false
      statusMessage.value = 'Piezīme saglabāta.'
      isError.value = false
    } else {
      statusMessage.value = 'Neizdevās saglabāt piezīmi.'
      isError.value = true
    }
  } catch (err) {
    console.error('Kļūda saglabājot piezīmi:', err)
    statusMessage.value = 'Radās kļūda, mēģiniet vēlreiz.'
    isError.value = true
  }
  setTimeout(() => {
    statusMessage.value = ''
  }, 3000)
}
</script>
