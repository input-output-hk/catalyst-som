<template>
  <div class="block new-signoff-popup">
    <div class="card">
      <header class="card-header">
        <p class="card-header-title">
          {{ $t('new_signoff.title') }}
        </p>
      </header>
      <div class="card-content">
        <p>
          {{ $t(
              'new_signoff.confirm',
              {
                entity: (poa) ? $t('new_signoff.poa') : $t('new_signoff.som')
              }
            )
          }}
        </p>
        <div class="buttons">
          <o-button
            :disabled="submitting"
            class="submit-signoff"
            variant="primary"
            size="medium"
            @click="signoff">
            {{ $t('new_signoff.signoff') }}
          </o-button>
          <o-button
            size="medium"
            @click="emit('clearSignoff')">
            {{ $t('new_signoff.cancel') }}
          </o-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useSignoffs } from '@/store/signoffs.js'
const props = defineProps({
  som: {
    type: Object,
    default: () => {}
  },
  poa: {
    type: Object,
    default: () => {}
  }
})
const emit = defineEmits(['clearSignoff'])

const { createSignoff } = useSignoffs()
const submitting = ref(false)

const signoff = async () => {
  submitting.value = true
  let data
  if (props.poa) {
    data = { poa_id: props.poa.id }
  } else if (props.som) {
    data = { som_id: props.som.id }
  }
  const response = await createSignoff(data, props.som)
  if (response) {
    emit('clearSignoff')
    submitting.value = false
  }
}
</script>
