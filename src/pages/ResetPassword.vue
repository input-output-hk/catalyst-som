<template>
  <form class="content">
    <div class="col-6 form-widget" v-if="resetActive">
      <h2 class="title">Reset password</h2>
      <div>
        <o-field label="Password">
          <o-input v-model="password" type="password"></o-input>
        </o-field>
      </div>
      <div>
        <o-button
          @click="handleReset"
          type="submit">
            Reset
        </o-button>
      </div>
    </div>
  </form>
</template>

<script setup>
  import { ref, onMounted } from 'vue'
  import { useUser } from '../store/user.js'
  const { updatePassword } = useUser()

  const resetActive = ref(false)
  const loading = ref(false)
  const password = ref('')

  const handleReset = async () => {
    return updatePassword(pasword.value)
  }

  onMounted(async () => {
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event == "PASSWORD_RECOVERY") {
        resetActive.value = true
      }
    })
  })

</script>
