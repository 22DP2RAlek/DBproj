<template>
  <div class="login-container">
    <h2>Register</h2>
    <form @submit.prevent="handleRegister">
      <input type="text" v-model="name" placeholder="Name" required />
      <input type="email" v-model="email" placeholder="Email" required />
      <input type="password" v-model="password" placeholder="Password" required />
      <input type="password" v-model="confirmPassword" placeholder="Confirm Password" required />
      <button type="submit" :disabled="loading">
        {{ loading ? 'Registering...' : 'Register' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import '../assets/login.css'

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)

const handleRegister = async () => {
  if (password.value !== confirmPassword.value) {
    alert("Passwords do not match.")
    return
  }

  loading.value = true

  try {
    const response = await axios.post('http://localhost:3000/api/register', {
      vards: name.value,
      epasts: email.value,
      parole: password.value,
    })
    alert(response.data.message || 'Registration successful!')
    // Optionally clear inputs or redirect to login page here
  } catch (error) {
    if (error.response) {
      alert(error.response.data.message || 'Registration failed')
    } else {
      alert('Network or server error')
    }
  } finally {
    loading.value = false
  }
}
</script>
