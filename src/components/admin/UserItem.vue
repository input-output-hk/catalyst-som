<template>
  <tr>
    <td>{{user.email}}</td>
    <td>{{user.username}}</td>
    <td>
      <o-select placeholder="Select a name" v-model="role">
        <option :value="r" v-for="r in Object.keys(roles)">{{roles[r]}}</option>
      </o-select>
    </td>
    <td>
      <o-inputitems
        v-model="userChallenges"
        :data="filteredChallenges"
        autocomplete
        :allow-new="false"
        :open-on-focus="true"
        field="title"
        placeholder="Add a challenge"
        @typing="getFilteredChallenges"
      >
      </o-inputitems>
    </td>
    <td>
      <o-inputitems
        v-model="userProposals"
        :data="proposals"
        autocomplete
        :allow-new="false"
        :open-on-focus="true"
        field="title"
        placeholder="Add a proposal"
        @typing="getFilteredProposals"
      >
      </o-inputitems>
    </td>
  </tr>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { storeToRefs } from 'pinia'
const props = defineProps(['user'])

import { useChallenges } from '../../store/challenges.js'
const challengesStore = useChallenges()
const { getChallenges } = challengesStore
const { challenges } = storeToRefs(challengesStore)

import { useProposals } from '../../store/proposals.js'
const proposalsStore = useProposals()
const { getProposalsByTitle } = proposalsStore
const { proposals } = storeToRefs(proposalsStore)

import { useUsers } from '../../store/users.js'
const { updateUserChallenges, updateUserProposals, updateRole } = useUsers()

import { roles } from '@/utils/roles'

const role = computed({
  get: () => props.user.role,
  set: (val) => {
    updateRole(parseInt(val), props.user)
  }
})

const userChallenges = computed({
  get: () => props.user.challenges_users.map((el) => el.challenges),
  set: val => {
    const toSend = val.map((el) => {
      return {
        user_idd: props.user.id,
        challenge_id: el.id,
        user_id: props.user.user_id
      }
    })
    updateUserChallenges(toSend, props.user)
  }
})

const userProposals = computed({
  get: () => props.user.proposals_users.map((el) => el.proposals),
  set: val => {
    const toSend = val.map((el) => {
      return {
        user_idd: props.user.id,
        proposal_id: el.id,
        user_id: props.user.user_id
      }
    })
    updateUserProposals(toSend, props.user)
  }
})

const filteredChallenges = ref([])
// const userChallenges = ref(props.user.challenges_users)

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
  await getProposalsByTitle(text)
}

onMounted(() => {
  getChallenges()
})

watch(challenges, () => {
  filteredChallenges.value = challenges.value
})

/*
watch(props.user.challenges_users, () => {
  console.log(props.user)
  userChallenges.value = props.user.challenges_users
})
*/

</script>
