<template>
  <div class="content">
    <div class="col-6 form-widget">
      <o-field label="Email">
        <o-input v-model="email" type="email"></o-input>
      </o-field>
      <o-field label="Password">
        <o-input v-model="password" type="password"></o-input>
      </o-field>
      <o-button
        @click="handleLogin"
        type="submit">
          {{ loginMsg }}
      </o-button>
      <input
        @click="handleReset"
        type="button"
        class="button block"
        :value="'Reset password'"
        :disabled="loading"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useUser } from '../store/user.js'
const { login, resetPassword } = useUser()

const loading = ref(false)
const email = ref('')
const password = ref('')

const handleLogin = async () => {
  return login(email.value, password.value)
}
const handleReset = async () => {
  return resetPassword(email.value)
}
</script>

<script>
import { computed } from 'vue'
import { mapState } from 'pinia'

export default {
  computed: {
    ...mapState(useUser, {
      user: 'user',
      fetching: 'fetching'
    }),
    loginMsg() {
      return (this.fetching) ? 'Loading...' : 'Login'
    }
  },

  created() {
  }
}
</script>
