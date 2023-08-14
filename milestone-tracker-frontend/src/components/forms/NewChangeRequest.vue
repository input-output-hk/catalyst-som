<template>
  <div class="block new-signoff-popup">
    <div class="card">
      <header class="card-header">
        <p class="card-header-title">
          {{ $t('change_requests.new_title') }}
        </p>
      </header>
      <div class="card-content">
        <p>
          {{ $t('change_requests.new_confirm') }}
        </p>
        <div class="buttons">
          <o-button
            :disabled="submitting"
            class="submit-change-request"
            variant="primary"
            size="medium"
            @click="submitChangeRequest">
            {{ $t('change_requests.new_create') }}
          </o-button>
          <o-button
            size="medium"
            @click="emit('clearChangeRequest')">
            {{ $t('change_requests.cancel') }}
          </o-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useChangeRequests } from '@/store/changeRequests.js'
const props = defineProps({
  proposal: {
    type: Object,
    default: () => {}
  }
})
const emit = defineEmits(['clearChangeRequest'])

const { createChangeRequest } = useChangeRequests()
const submitting = ref(false)

const submitChangeRequest = async () => {
  submitting.value = true
  const data = { proposal_id: props.proposal.id }
  const response = await createChangeRequest(data)
  if (response) {
    emit('clearChangeRequest')
    submitting.value = false
  }
}
</script>
