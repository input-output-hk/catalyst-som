<template>
  <footer class="footer has-background-primary has-text-white">
    <div class="container">
      <section class="section">
        <div class="columns">
          <div class="column is-4">
            <p class=""><img class="logo" :src="logoUrl" :alt="$t('global.title')" /></p>
          </div>
          <div class="column is-4">
            <p class="has-text-weight-semibold mb-3">{{ $t('global.title') }}</p>
            <p class="mb-3"><a class="has-text-white" href="https://projectcatalyst.io" target="_blank">{{ $t('footer.website') }}</a></p>
            <p class="mb-3"><a class="has-text-white" href="https://docs.projectcatalyst.io" target="_blank">{{ $t('footer.knowledge_base') }}</a></p>
            <p class="mb-3"><a class="has-text-white" href="https://static.iohk.io/terms/iog-privacy-policy.pdf" target="_blank">{{ $t('footer.privacy_policy') }}</a></p>
          </div>
        </div>
      </section>
    </div>
  </footer>
</template>

<script setup>
import logoUrl from '@/assets/images/catalyst-logo-white.svg'
</script>

<style lang="scss" scoped>
  .logo {
    max-height: 3.5rem;
  }
</style>