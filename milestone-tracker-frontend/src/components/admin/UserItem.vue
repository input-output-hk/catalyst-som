<template>
  <tr>
    <td>{{item.email}}</td>
    <td>
      <o-select v-model="role" :placeholder="$t('admin.select_role')">
        <option v-for="r in Object.keys(roles)" :key="r" :value="r">
          {{$t(`roles.${roles[r]}`)}}
        </option>
      </o-select>
    </td>
    <td>
      <o-inputitems
        v-model="userChallenges"
        :data="filteredChallenges"
        allow-autocomplete
        :allow-new="false"
        :open-on-focus="true"
        field="title"
        :placeholder="$t('admin.add_challenge')"
        @typing="getFilteredChallenges"
      >
      </o-inputitems>
    </td>
    <td>
      <o-inputitems
        v-model="userProposals"
        :data="selectProposals"
        allow-autocomplete
        :allow-new="false"
        :open-on-focus="true"
        field="title"
        :placeholder="$t('admin.add_proposal')"
        @typing="getFilteredProposals"
      >
      </o-inputitems>
    </td>
    <td>
      <o-inputitems
        v-model="userAllocatedProposals"
        :data="selectProposals"
        allow-autocomplete
        :allow-new="false"
        :open-on-focus="true"
        field="title"
        :placeholder="$t('admin.add_proposal')"
        @typing="getFilteredProposals"
      >
      </o-inputitems>
    </td>
  </tr>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { storeToRefs } from 'pinia'
const props = defineProps({
  item: {
    type: Object,
    default: () => {}
  }
})

import { useChallenges } from '@/store/challenges.js'
const challengesStore = useChallenges()
const { getChallenges } = challengesStore
const { challenges } = storeToRefs(challengesStore)

import { useProposals } from '@/store/proposals.js'
const proposalsStore = useProposals()
const { getSelectProposalsByTitle } = proposalsStore
const { selectProposals } = storeToRefs(proposalsStore)

import { useUsers } from '@/store/users.js'
const {
  updateUserChallenges,
  updateUserProposals,
  updateUserAllocatedProposals,
  updateRole
} = useUsers()

import { roles } from '@/utils/roles'

const role = computed({
  get: () => props.item.role,
  set: (val) => {
    updateRole(parseInt(val), props.item)
  }
})

const userChallenges = computed({
  get: () => props.item.challenges_users.map((el) => el.challenges).filter((el) => (el)),
  set: val => {
    const toSend = val.map((el) => {
      return {
        user_idd: props.item.id,
        challenge_id: el.id,
        user_id: props.item.user_id
      }
    })
    updateUserChallenges(toSend, props.item)
  }
})

const userProposals = computed({
  get: () => props.item.proposals_users.map((el) => el.proposals).filter((el) => (el)),
  set: val => {
    const toSend = val.map((el) => {
      return {
        user_idd: props.item.id,
        proposal_id: el.id,
        user_id: props.item.user_id
      }
    })
    updateUserProposals(toSend, props.item)
  }
})

const userAllocatedProposals = computed({
  get: () => props.item.allocations.map((el) => el.proposals).filter((el) => (el)),
  set: val => {
    const toSend = val.map((el) => {
      return {
        user_idd: props.item.id,
        proposal_id: el.id,
        user_id: props.item.user_id
      }
    })
    updateUserAllocatedProposals(toSend, props.item)
  }
})

const filteredChallenges = ref([])

const getFilteredChallenges = (text) => {
  if (text.length) {
    filteredChallenges.value = challenges.value.filter(option => {
      return (
        option.title
          .toString()
          .toLowerCase()
          .indexOf(text.toLowerCase()) >= 0
      )
    })
  } else {
    filteredChallenges.value = challenges.value
  }
}

const getFilteredProposals = async (text) => {
  await getSelectProposalsByTitle(text)
}

onMounted(() => {
  getChallenges()
})

watch(challenges, () => {
  filteredChallenges.value = challenges.value
})

</script>

<style lang="scss">
.taginput.control .taginput-container .tag > span:not(.icon) {
  max-width: 350px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>