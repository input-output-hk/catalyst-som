<template>
  <section class="section">
    <div class="content">
      <div class="columns is-multiline">
        <div class="column is-8">
          <h1 class="is-size-1">{{ $t('pages.reset_password.title') }}</h1>
          <p>{{ $t('pages.reset_password.description') }}</p>
        </div>
        <div class="column is-6">
          <form @submit.prevent="handleReset" v-if="resetActive">
            <o-field :label="$t('pages.reset_password.password')">
              <o-input v-model="password" type="password" minlength="7" maxlength="100"></o-input>
            </o-field>
            <o-field
              :variant="(password !== password_confirmation) ? 'danger' : ''"
              :message="(password !== password_confirmation) ? $t('pages.reset_password.passwords_dont_match') : ''"
              :label="$t('pages.reset_password.password_confirmation')">
              <o-input v-model="password_confirmation" type="password" minlength="7" maxlength="100"></o-input>
            </o-field>
            <div class="buttons mt-6">
              <o-button
                class="login"
                :disabled="password.length === 0 || (password !== password_confirmation) || loading"
                variant="primary"
                size="medium"
                native-type="submit">
                  {{ $t('pages.reset_password.reset') }}
              </o-button>
            </div>
          </form>
          <o-notification v-if="!resetActive">
            {{ $t('pages.reset_password.no_reset') }}
          </o-notification>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
  import { ref, onMounted } from 'vue'
  import { useUser } from '@/store/user.js'
  import { supabase } from '@/utils/supabase'
  const { updatePassword } = useUser()

  const resetActive = ref(true)
  const password = ref('')
  const password_confirmation = ref('')
  const loading = ref(false)

  const handleReset = async () => {
    loading.value = true
    updatePassword(password.value)
    loading.value = false
  }

  onMounted(async () => {
    supabase.auth.onAuthStateChange(async (event) => {
      if (event == "PASSWORD_RECOVERY") {
        resetActive.value = true
      }
    })
  })

</script>
