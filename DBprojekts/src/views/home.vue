<template>
  <div>
    <!-- Navigation menu -->
    <section class="p-menu1">
      <nav id="navbar" class="navigation" role="navigation">
        <input id="toggle1" type="checkbox" />
        <label class="hamburger1" for="toggle1">
          <div class="top"></div>
          <div class="meat"></div>
          <div class="bottom"></div>
        </label>

        <nav class="menu1">
          <router-link to="/home">Sākums</router-link>
          <a href="#">Par mums</a>
          <a href="#">Kontakti</a>
          <router-link to="/cards">Kartiņas</router-link>
        </nav>
      </nav>
    </section>

    <!-- Header -->
    <header>
      <h3>Ceļojumu Aģentūra</h3>
    </header>

    <!-- Main content -->
    <main>
      <h2>Ceļojums</h2>
      <p>Palīdzēsim tev plānot savu ceļojumu pa Latviju.</p>

      <img
        src="https://www.landofexperiences.gr/wp-content/uploads/2016/11/banner_gouves_beach-200x200.jpg"
        alt="Bilde"
        height="90%"
      />
    </main>

    <!-- Footer -->
    <footer>
      <p>Kontakti +371 21345678</p>
    </footer>
  </div>
</template>

<script setup>
// You can import any required JavaScript functionality here
</script>

<style scoped>
/* Import the external CSS file here */
@import '../assets/home.css';
</style>
