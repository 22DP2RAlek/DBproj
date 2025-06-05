<template>
  <div id="app">
    <Header />
    <router-view />
  </div>
</template>

<script setup>
import Header from './components/header.vue'
import './assets/hamburger.css';

</script>