<template>
  <div class="content">
    <h1 class="is-size-1">User Profile</h1>
    <div class="content">
      <div class="box">
        <div class="columns">
          <div class="column is-3">Email:</div>
          <div class="column is-9">{{ localUser.email }}</div>
        </div>
        <div class="columns">
          <div class="column is-3">Username:</div>
          <div class="column is-9">{{ getUserInfo.username }}</div>
        </div>
        <div class="columns">
          <div class="column is-3">Role:</div>
          <div class="column is-9">{{ role }}</div>
        </div>
        <div class="columns">
          <div class="column is-3">Proposals (as Funded Proposer):</div>
          <div class="column is-9">
            <ul>
              <li v-for="proposal in proposals">
                <router-link class="navbar-item" :to="{
                  name: 'proposal',
                  params: {id: proposal.project_id}
                  }">{{proposal.title}}</router-link>
              </li>
            </ul>
          </div>
        </div>
        <div class="columns">
          <div class="column is-3">Challenges (as Challenge Team):</div>
          <div class="column is-9">
            <ul>
              <li v-for="challenge in challenges">
                {{challenge.title}}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted, computed } from 'vue'
  import { useUser } from '../store/user.js'
  import { roles } from '@/utils/roles.js'
  const { getUserInfo, localUser } = useUser()

  const role = computed(() => roles[getUserInfo.role])
  const proposals = computed(() => {
    return getUserInfo.proposals_users.map((el) => el.proposals)
  })
  const challenges = computed(() => {
    return getUserInfo.challenges_users.map((el) => el.challenges)
  })
</script>
