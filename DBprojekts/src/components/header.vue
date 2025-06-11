<script setup>
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { isLoggedIn, userName, logout } = useAuth()

const handleLogout = () => {
  logout()
  router.push('/login')
}
</script>

<template>
  <section class="p-menu1">
    <nav id="navbar" class="navigation" role="navigation">

      <!-- Left buttons -->
      <div class="left-buttons">
        <!-- If logged in -->
        <template v-if="isLoggedIn">
          <span class="user-name">Hello, {{ userName }}!</span>
          <button class="btn logout-btn" @click="handleLogout">Logout</button>
        </template>

        <!-- If not logged in -->
        <template v-else>
          <router-link class="btn" to="/login">Login</router-link>
          <router-link class="btn" to="/register">Register</router-link>
        </template>
      </div>

      <!-- Hamburger input & label -->
      <input id="toggle1" type="checkbox" />
      <label class="hamburger1" for="toggle1">
        <div class="top"></div>
        <div class="meat"></div>
        <div class="bottom"></div>
      </label>

      <!-- Dropdown menu -->
      <nav class="menu1">
        <router-link to="/">Sākums</router-link>
        <router-link to="/about">Par mums</router-link>
        <router-link to="/cards">Kartiņas</router-link>
        <router-link to="/map">Karte</router-link>
      </nav>
    </nav>
  </section>
</template>
