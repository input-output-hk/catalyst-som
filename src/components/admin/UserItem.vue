<template>
  <div class="columns">
    <div class="column is-4">
      {{user.email}}
      {{userChallenges}}
    </div>
    <div class="column is-4">
      <o-field label="Select Challenges">
        <o-inputitems
          v-model="userChallenges"
          :data="filteredChallenges"
          autocomplete
          :allow-new="false"
          :open-on-focus="true"
          field="title"
          icon="tag"
          placeholder="Add an item"
          @typing="getFilteredChallenges"
        >
        </o-inputitems>
      </o-field>
    </div>
    <div class="column is-4">&nbsp;</div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { storeToRefs } from 'pinia'
const props = defineProps(['user'])

import { useChallenges } from '../../store/challenges.js'
const challengesStore = useChallenges()
const { getChallenges } = challengesStore
const { challenges } = storeToRefs(challengesStore)

import { useUsers } from '../../store/users.js'
const { updateUserChallenges } = useUsers()

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
    console.log(toSend)
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
