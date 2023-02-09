<template>
  <div>
    <nav-bar />
    <o-notification
      closable
      v-if="activeMsg"
      variant="warning"
      aria-close-label="Close notification"
      role="alert">
        This is a test environment. All the information in this platform are intended only for testing purpose.
        Feel free to submit SoM / PoA / Reviews and signoff. Please use <a href="https://forms.gle/KmSkWqa1Ua6UUQr28" target="_blank">this form</a>
        to submit feedback and bug reports.
    </o-notification>
    <router-view></router-view>
    <footer class="footer mt-6 has-background-primary has-text-white has-text-weight-semibold">
      <div class="content has-text-centered">
        <p>Project Catalyst - Milestone module</p>
       </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import NavBar from '@/components/NavBar.vue'

const activeMsg = ref(false)
</script>

<style lang="scss">
.scrollable-modal {
  overflow: auto !important;
  max-height: 90vh
}
</style>
