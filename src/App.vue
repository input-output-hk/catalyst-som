<template>
  <div>
    <nav-bar />
    <router-view></router-view>
    <footer class="footer mt-6 has-background-primary has-text-white has-text-weight-semibold">
      <div class="content has-text-centered">
        <p>Project Catalyst - Milestone module</p>
       </div>
    </footer>
  </div>
</template>

<script setup>
import NavBar from '@/components/NavBar.vue'
</script>

<style lang="scss">
.scrollable-modal {
  overflow: auto !important;
  max-height: 90vh
}
</style>
