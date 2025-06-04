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
        <a href="/">Sākums</a>
        <a href="#">Par mums</a>
        <a href="#">Kontakti</a>
        <a href="/cards">Kartiņas</a>
      </nav>
    </nav>
  </section>

  <div class="card-container">
    <div class="card" v-for="(city, index) in cards" :key="index">
      <img :src="city.image" :alt="city.name" />
      <div class="card-content">
        <h3>{{ city.name }}</h3>
        <p>{{ city.description }}</p>
        <button>Apskatīt</button>
      </div>
    </div>
  </div>
</template>

<script setup>
const cards = [
  {
    name: 'Jelgava',
    image: 'https://zz.lv/wp-content/uploads/2023/09/Jelgava-scaled.jpg',
    description: 'Jelgava ir skaista pilsēta netālu no Rīgas.',
  },
  {
    name: 'Liepāja',
    image: 'https://static.lsm.lv/media/2024/07/large/1/o4sa.jpg',
    description: 'Liepāja ir trešā lielākā pilsēta Latvijā. Tā ir lielākā Kurzemes pilsēta.',
  },
  {
    name: 'Rīga',
    image: 'https://www.sundaypost.com/wp-content/uploads/sites/13/2018/05/iStock-527672859.jpg.jpg',
    description: 'Lielākā Latvijas pilsēta un Latvijas galvaspilsēta ir Rīga.',
  },
]
</script>

<style src="./card.css"></style>
