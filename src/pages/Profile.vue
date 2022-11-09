<template>
  <section class="section">
    <div class="content">
      <h1 class="is-size-1">User Profile</h1>
      <table class="table is-bordered is-striped">
        <tbody class="som-recap">
          <tr>
            <th>Email</th>
            <td>{{ localUser.email }}</td>
          </tr>
          <tr>
            <th>Username</th>
            <td>{{ localUser.username }}</td>
          </tr>
          <tr>
            <th>Role</th>
            <td>{{ role }}</td>
          </tr>
          <tr>
            <th>Proposals (as Funded Proposer):</th>
            <td>
              <ul>
                <li v-for="proposal in proposals">
                  <router-link class="navbar-item" :to="{
                    name: 'proposal',
                    params: {id: proposal.project_id}
                    }">{{proposal.title}}</router-link>
                </li>
              </ul>
            </td>
          </tr>
          <tr>
            <th>Challenges (as Challenge Team):</th>
            <td>
              <ul>
                <li v-for="challenge in challenges">
                  {{challenge.title}}
                </li>
              </ul>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
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
