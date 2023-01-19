<template>
  <table class="table is-bordered is-striped" v-if="canSetAllocations">
    <tbody>
      <tr>
        <th>{{ $t('allocation.allocation') }}</th>
        <td>
          <o-inputitems
            v-model="proposalAllocatedUsers"
            :data="selectUsers"
            autocomplete
            :allow-new="false"
            :open-on-focus="true"
            field="email"
            :placeholder="$t('allocation.add_allocation')"
            @typing="getFilteredUsers"
          >
      </o-inputitems>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useUser } from '@/store/user.js'
import { useUsers } from '@/store/users.js'
import { useProposals } from '@/store/proposals.js'

const props = defineProps(['proposal'])

const { canSetAllocations } = useUser()
const usersStore = useUsers()
const { getSelectUsersByEmail } = usersStore
const { selectUsers } = storeToRefs(usersStore)
const { updateProposalAllocations } = useProposals()

const proposalAllocatedUsers = computed({
  get: () => {
    if (props.proposal.allocations) {
      return props.proposal.allocations.map((el) => el.users)
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
})

const getFilteredUsers = async (text) => {
  await getSelectUsersByEmail(text)
}

</script>
