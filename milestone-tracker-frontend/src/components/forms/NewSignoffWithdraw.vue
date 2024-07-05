<template>
  <div class="block new-signoff-popup">
    <div class="card">
      <header class="card-header">
        <p class="card-header-title">
          {{ $t('new_signoff_withdraw.title') }}
        </p>
      </header>
      <div class="card-content">
        <p>
          {{ $t('new_signoff_withdraw.confirm') }}
        </p>
        <div class="buttons">
          <o-button
            :disabled="submitting"
            class="submit-signoff"
            variant="warning"
            size="medium"
            @click="signoffWithdraw">
            {{ $t('new_signoff_withdraw.withdraw') }}
          </o-button>
          <o-button
            size="medium"
            @click="emit('clearSignoffWithdraw')">
            {{ $t('new_signoff_withdraw.cancel') }}
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
  signoff: {
    type: Object,
    default: () => {}
  }
})
const emit = defineEmits(['clearSignoffWithdraw'])

const { deleteSignoff } = useSignoffs()
const submitting = ref(false)

const signoffWithdraw = async () => {
  submitting.value = true
  const response = await deleteSignoff(props.signoff, props.som)
  if (response) {
    emit('clearSignoffWithdraw')
    submitting.value = false
  }
}
</script>
