<template>
  <section class="p-menu1">
    <nav id="navbar" class="navigation" role="navigation">
      <input id="toggle1" type="checkbox" />
      <label class="hamburger1" for="toggle1">
        <div class="top"></div>
        <div class="meat"></div>
        <div class="bottom"></div>
      </label>

      <nav class="menu1">
        <!-- Use router-link for SPA navigation -->
    <router-link to="/">Sākums</router-link>
    <router-link to="/about">Par mums</router-link>
    <router-link to="/contacts">Kontakti</router-link>
    <router-link to="/cards">Kartiņas</router-link>
      </nav>
    </nav>
  </section>
</template>

<script>
export default {
  name: "Header",
};
</script>

<style scoped>
/* You can either import your hamburger.css here, or import it globally */
@import '../assets/hamburger.css';
</style>
