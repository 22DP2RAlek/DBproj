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
        <!-- Piesledzies -->
        <template v-if="isLoggedIn">
          <span class="user-name">Hello, {{ userName }}!</span>
          <button class="btn logout-btn" @click="handleLogout">Logout</button>
        </template>

        <!-- Nav piesledzies-->
        <template v-else>
          <router-link class="btn" to="/login">Login</router-link>
          <router-link class="btn" to="/register">Register</router-link>
        </template>
      </div>

      <!-- Hamburger -->
      <input id="toggle1" type="checkbox" />
      <label class="hamburger1" for="toggle1" aria-label="Toggle navigation menu">
        <div class="top"></div>
        <div class="meat"></div>
        <div class="bottom"></div>
      </label>

      <!-- Navigacijas linki -->
      <div class="menu1">
        <router-link to="/">Sākums</router-link>
        <router-link to="/map">Karte</router-link>
        <router-link to="/cards">Apskates objekti</router-link>
        <router-link to="/review">Atsauksmes</router-link>
        <router-link to="/savedSpots">Saglabātie objekti</router-link>
        <router-link to="/adminDB">Administratoriem </router-link>
      </div>

    </nav>
  </section>
</template>
