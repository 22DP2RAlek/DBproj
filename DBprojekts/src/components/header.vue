<template>
  <section class="p-menu1">
    <nav id="navbar" class="navigation" role="navigation">
      <!-- Login/Register -->
      <div class="left-buttons">
        <router-link class="btn" to="/login">Login</router-link>
        <router-link class="btn" to="/register">Register</router-link>
      </div>

      <!-- Hamburger input & label (must be adjacent!) -->
      <input id="toggle1" type="checkbox" />
      <label class="hamburger1" for="toggle1">
        <div class="top"></div>
        <div class="meat"></div>
        <div class="bottom"></div>
      </label>

      <!-- Collapsible menu (must be after label for selector to work) -->
      <nav class="menu1">
        <router-link to="/">Sākums</router-link>
        <router-link to="/about">Par mums</router-link>
        <router-link to="/cards">Kartiņas</router-link>
      </nav>
    </nav>
  </section>
</template>
