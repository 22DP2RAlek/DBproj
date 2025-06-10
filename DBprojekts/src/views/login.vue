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
    <p v-if="errorMessage" style="color:red">{{ errorMessage }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import '../assets/login.css' // ✅ Keep your CSS

const email = ref('')
const password = ref('')
const errorMessage = ref('')

const handleLogin = async () => {
  try {
    const response = await axios.post('http://localhost:3000/api/login', {
      epasts: email.value,
      parole: password.value
    })

    alert('Login successful! User ID: ' + response.data.userId)
    errorMessage.value = ''
  } catch (error) {
    if (error.response) {
      errorMessage.value = error.response.data.message || 'Login failed'
    } else {
      errorMessage.value = 'Server not reachable'
    }
  }
}
</script>
