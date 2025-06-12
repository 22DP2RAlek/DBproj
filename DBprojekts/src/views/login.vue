<template>
  <div class="login-container">
    <h2>Login</h2>
    <form @submit.prevent="handleLogin">
      <input
        type="email"
        v-model="email"
        placeholder="Email"
        required
      />
      <input
        type="password"
        v-model="password"
        placeholder="Password"
        required
      />
      <button type="submit">Login</button>
    </form>
    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { useAuth } from '@/composables/useAuth'
import '../assets/login.css'

const email = ref('')
const password = ref('')
const errorMessage = ref('')

const router = useRouter()
const { login } = useAuth()

const handleLogin = async () => {
  try {
    const response = await axios.post('http://localhost:3000/api/login', {
      epasts: email.value,
      parole: password.value
    })

    if (response.data.success) {
      // ✅ Update: use object for login() to match useAuth.js
      login({
        id: response.data.userId,
        name: response.data.vards,
        role: response.data.role
      })

      errorMessage.value = ''
      router.push('/')
    } else {
      errorMessage.value = response.data.message || 'Login failed'
    }
  } catch (error) {
    if (error.response) {
      errorMessage.value = error.response.data.message || 'Login failed'
    } else {
      errorMessage.value = 'Server not reachable'
    }
  }
}
</script>

<style scoped>
.error-message {
  color: red;
  margin-top: 1rem;
}
</style>
