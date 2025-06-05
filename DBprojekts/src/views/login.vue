<template>
  <div class="login-container">
    <h2>Login</h2>
    <form @submit.prevent="handleLogin">
      <input type="text" v-model="username" placeholder="Username" required />
      <input type="password" v-model="password" placeholder="Password" required />
      <button type="submit">Login</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import '../login.css' // 🔗 Import the CSS file

const username = ref('')
const password = ref('')

const handleLogin = () => {
  alert(`Username: ${username.value}\nPassword: ${password.value}`)
}
</script>
