<template>
  <section class="section">
    <div class="content">
      <div class="columns is-multiline">
        <div class="column is-8">
          <h1 class="is-size-1">{{ $t('pages.confirm_reset_password.title') }}</h1>
          <p>{{ $t('pages.confirm_reset_password.description') }}</p>
        </div>
        <div class="column is-6">
          <a v-if="confirmationUrl" :href="confirmationUrl">
            <o-button
              class="login"
              variant="primary"
              size="medium"
              native-type="submit">
                {{ $t('pages.confirm_reset_password.reset') }}
            </o-button>
          </a>
          <o-notification v-else>
            {{ $t('pages.confirm_reset_password.no_reset') }}
              <router-link to="/login">{{ $t('pages.confirm_reset_password.login') }}</router-link>.
          </o-notification>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
  import { computed } from 'vue'
  import { env } from '@/env'
  import { useRoute, useRouter } from 'vue-router'


  const route = useRoute()
  const router = useRouter()
  
  const resetUrl = window.location.origin + router.resolve({
    name: 'reset-password'
  }).href

  const confirmationUrl = computed(() => {
    if (route.query.token) {
      return `${env.VITE_SUPABASE_URL}/auth/v1/verify?token=${route.query.token}&type=recovery&redirect_to=${resetUrl}`
    } else {
      return false
    }
  })


</script>
