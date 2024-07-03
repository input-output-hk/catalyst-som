<template>
  <div>
    <o-button v-if="canSetMilestoneQty" variant="warning" @click="confirmChangeMilestoneQty = !confirmChangeMilestoneQty">
      {{ $t('proposal_recap.activate_change_milestone_qty') }}
    </o-button>
    <o-modal v-if="canSetMilestoneQty" v-model:active="confirmChangeMilestoneQty">
      <new-milestone-qty :proposal="proposal" @clear-change-milestone-qty="closedCallback" />
    </o-modal>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import NewMilestoneQty from '@/components/forms/NewMilestoneQty.vue'

const router = useRouter()
const confirmChangeMilestoneQty = ref(false)

const props = defineProps({
  proposal: {
    type: Object,
    default: () => {}
  },
  canSetMilestoneQty: {
    type: Boolean,
    default: false
  }
})

const closedCallback = () => {
  confirmChangeMilestoneQty.value = false
  router.push({name: 'proposal', params: { id: props.proposal.project_id}})
}

</script>