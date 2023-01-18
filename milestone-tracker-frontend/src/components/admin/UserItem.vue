<template>
  <tr>
    <td>{{item.email}}</td>
    <td>{{item.username}}</td>
    <td>
      <o-select :placeholder="$t('admin.select_role')" v-model="role">
        <option :value="r" v-for="r in Object.keys(roles)">
          {{$t(`roles.${roles[r]}`)}}
        </option>
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
        :placeholder="$t('admin.add_challenge')"
        @typing="getFilteredChallenges"
      >
      </o-inputitems>
    </td>
    <td>
      <o-inputitems
        v-model="userProposals"
        :data="selectProposals"
        autocomplete
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
const props = defineProps(['item'])

import { useChallenges } from '@/store/challenges.js'
const challengesStore = useChallenges()
const { getChallenges } = challengesStore
const { challenges } = storeToRefs(challengesStore)

import { useProposals } from '@/store/proposals.js'
const proposalsStore = useProposals()
const { getSelectProposalsByTitle } = proposalsStore
const { selectProposals } = storeToRefs(proposalsStore)

import { useUsers } from '@/store/users.js'
const { updateUserChallenges, updateUserProposals, updateRole } = useUsers()

import { roles } from '@/utils/roles'

const role = computed({
  get: () => props.item.role,
  set: (val) => {
    updateRole(parseInt(val), props.item)
  }
})

const userChallenges = computed({
  get: () => props.item.challenges_users.map((el) => el.challenges),
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
  get: () => props.item.proposals_users.map((el) => el.proposals),
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
