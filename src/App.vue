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
    <footer class="footer mt-6 has-background-primary has-text-white has-text-weight-semibold">
      <div class="content has-text-centered">
        <p>Project Catalyst - Milestone module</p>
       </div>
    </footer>
  </div>
</template>

<style>
.scrollable-modal {
  overflow: auto !important;
  max-height: 90vh
}
</style>
