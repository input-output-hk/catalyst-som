<template>
  <section class="section">
    <div class="content">
      <div class="columns is-multiline">
        <div class="column is-8">
          <h1 class="is-size-1">{{ $t('pages.login.title') }}</h1>
          <p>{{ $t('pages.login.description') }}</p>
        </div>
        <div class="column is-6">
          <form @submit.prevent="handleLogin">
            <o-field :label="$t('pages.login.email')">
              <o-input v-model="email" type="email"></o-input>
            </o-field>
            <o-field :label="$t('pages.login.password')">
              <o-input v-model="password" type="password"></o-input>
            </o-field>
            <div class="buttons mt-6">
              <o-button
                class="login"
                :disabled="password.length === 0 || email.length === 0 || loading"
                variant="primary"
                size="medium"
                native-type="submit">
                  {{ loading ? $t('pages.login.loading') : $t('pages.login.login') }}
              </o-button>
              <o-button
                class="reset"
                variant="primary"
                size="medium"
                :disabled="loadingReset || email.length === 0"
                @click="handleReset">
                {{ loadingReset ? $t('pages.login.loading') : $t('pages.login.reset') }}
              </o-button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useUser } from '../store/user.js'
const { login, resetPassword } = useUser()

const loading = ref(false)
const loadingReset = ref(false)
const email = ref('')
const password = ref('')

const handleLogin = async () => {
  loading.value = true
  await login(email.value, password.value)
  loading.value = false
}
const handleReset = async () => {
  loadingReset.value = true
  await resetPassword(email.value)
  loadingReset.value = false
}
</script>

<script>
import { mapState } from 'pinia'

export default {
  computed: {
    ...mapState(useUser, {
      user: 'user'
    })
  },

  created() {
  }
}
</script>
