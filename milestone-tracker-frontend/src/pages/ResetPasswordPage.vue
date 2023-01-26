<template>
  <section class="section">
    <div class="content">
      <div class="columns is-multiline">
        <div class="column is-8">
          <h1 class="is-size-1">{{ $t('pages.reset_password.title') }}</h1>
          <p>{{ $t('pages.reset_password.description') }}</p>
        </div>
        <div class="column is-6">
          <form class="content">
            <div v-if="resetActive" class="col-6 form-widget">
              <h2 class="title"></h2>
              <div>
                <o-field :label="$t('pages.reset_password.password')">
                  <o-input v-model="password" type="password"></o-input>
                </o-field>
              </div>
              <div class="buttons mt-6">
                <o-button
                  type="submit"
                  @click="handleReset">
                    {{ $t('pages.reset_password.reset') }}
                </o-button>
              </div>
            </div>
          </form>
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

  const resetActive = ref(false)
  const password = ref('')

  const handleReset = async () => {
    return updatePassword(password.value)
  }

  onMounted(async () => {
    supabase.auth.onAuthStateChange(async (event) => {
      if (event == "PASSWORD_RECOVERY") {
        resetActive.value = true
      }
    })
  })

</script>
