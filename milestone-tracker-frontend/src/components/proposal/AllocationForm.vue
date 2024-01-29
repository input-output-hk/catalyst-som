<template>
  <o-inputitems
    v-if="allocatedUsers"
    v-model="allocatedUsers"
    :data="selectUsers"
    allow-autocomplete
    :allow-new="false"
    :open-on-focus="true"
    field="email"
    :placeholder="$t('allocation.add_allocation')"
    @typing="getFilteredUsers"
  >
  </o-inputitems>
</template>

<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useUsers } from '@/store/users.js'
import { useProposals } from '@/store/proposals.js'

const props = defineProps({
  proposal: {
    type: Object,
    default: () => {}
  },
  allocationType: {
    type: String,
    default: 'reviewers'
  }
})

const usersStore = useUsers()
const { getSelectUsersByEmail } = usersStore
const { selectUsers } = storeToRefs(usersStore)
const { 
  updateProposalAllocations,
  updateProposalSignoffAllocations,
  updateProposalOwnership
} = useProposals()

const allocationCallbacks = {
  proposers: {
    get: () => {
      if (props.proposal.proposals_users) {
        return props.proposal.proposals_users.map((el) => el.users).filter((el) => (el))
      }
      return []
    },
    set: val => {
      const toSend = val.map((el) => {
        return {
          user_idd: el.id,
          proposal_id: props.proposal.id,
          user_id: el.user_id
        }
      })
      updateProposalOwnership(toSend, props.proposal)
    }
  },
  reviewers: {
    get: () => {
      if (props.proposal.allocations) {
        return props.proposal.allocations.map((el) => el.users).filter((el) => (el))
      }
      return []
    },
    set: val => {
      const toSend = val.map((el) => {
        return {
          user_idd: el.id,
          proposal_id: props.proposal.id,
          user_id: el.user_id
        }
      })
      updateProposalAllocations(toSend, props.proposal)
    }
  },
  signoffs: {
    get: () => {
      if (props.proposal.allocations_signoff) {
        return props.proposal.allocations_signoff.map((el) => el.users).filter((el) => (el))
      }
      return []
    },
    set: val => {
      const toSend = val.map((el) => {
        return {
          user_idd: el.id,
          proposal_id: props.proposal.id,
          user_id: el.user_id
        }
      })
      updateProposalSignoffAllocations(toSend, props.proposal)
    }
  }
}

const allocatedUsers = computed({
  get: allocationCallbacks[props.allocationType].get,
  set: allocationCallbacks[props.allocationType].set,
  
})

const getFilteredUsers = async (text) => {
  await getSelectUsersByEmail(text)
}

</script>

<style lang="scss">
.taginput-container .tag .icon.is-clickable {
  overflow: hidden;
}
</style>