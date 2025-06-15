<template>
  <div class="home-container">
    <h1>Atklāj Latvijas Skaistākos Stūrus</h1>
    <p>Plāno savu nākamo ceļojumu, dalies iespaidos un atklāj slēptos dārgumus visā Latvijā.</p>

  </div>
</template>

<script setup>

</script>

<style scoped>
.home-container {
  max-width: 1000px;
  margin: 5rem auto 2rem;
  padding: 2rem;
  font-family: Arial, sans-serif;
  background: #f5f5f5;
  border-radius: 12px;
  box-shadow: 0 0 30px #00000020;
  text-align: center;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
}

p {
  font-size: 1.2rem;
  color: #555;
  margin-bottom: 2rem;
}

.explore-button {
  padding: 0.75rem 1.5rem;
  font-size: 1.1rem;
  color: #fff;
  background: #007bff;
  border: none;
  border-radius: 8px;
  box-shadow: 0 0 10px #00000020;
  transition: background 0.3s ease;
  cursor: pointer;
}

.explore-button:hover {
  background: #0056b3;
}
</style>
