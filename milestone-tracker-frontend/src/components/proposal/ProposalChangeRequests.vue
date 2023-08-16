<template>
  <div>
    <o-button variant="warning" @click="confirmChangeRequest = !confirmChangeRequest">
      {{ $t('proposal_recap.activate_change_request') }}
    </o-button>
    <o-modal v-model:active="confirmChangeRequest">
      <new-change-request :proposal="proposal" @clear-change-request="confirmChangeRequest = false" />
    </o-modal>
    <ul v-if="proposal.change_request?.length > 0">
      <li v-for="cr in proposal.change_request" :key="cr.id">
        {{$d(cr.created_at, 'long_compact')}} - <a :href="cr.url" target="_blank">{{ $t('proposal_recap.link_to_cr') }}</a>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from 'vue'

import NewChangeRequest from '@/components/forms/NewChangeRequest.vue'

const confirmChangeRequest = ref(false)

defineProps({
  proposal: {
    type: Object,
    default: () => {}
  },
})

</script>