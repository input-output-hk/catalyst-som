<template>
  <section class="section">
    <div class="content">
      <div class="columns is-multiline">
        <div class="column is-8">
          <h1 class="is-size-1">Login</h1>
          <p>Login as Funded Proposer, Challenge Team member or IOG member to interact with milestones.</p>
        </div>
        <div class="column is-6">
          <o-field label="Email">
            <o-input v-model="email" type="email"></o-input>
          </o-field>
          <o-field label="Password">
            <o-input v-model="password" type="password"></o-input>
          </o-field>
          <div class="buttons mt-6">
            <o-button
              variant="primary"
              size="medium"
              @click="handleLogin"
              type="submit">
                {{ loginMsg }}
            </o-button>
            <o-button
              @click="handleReset"
              variant="primary"
              size="medium"
              :disabled="loading || email.length === 0">
              Reset Password
            </o-button>
          </div>
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
