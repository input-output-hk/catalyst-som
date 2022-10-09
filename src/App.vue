<script>

import NavBar from './components/NavBar.vue'

export default {
  name: 'App',
  components: {
    NavBar
  }
}

</script>

<template>
  <div>
    <nav-bar />
    <div class="container mt-6 mb-6">
      <router-view></router-view>
    </div>
    <footer class="footer mt-6">
      <div class="content has-text-centered">
        <p>Project Catalyst - Milestone module</p>
       </div>
    </footer>
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
