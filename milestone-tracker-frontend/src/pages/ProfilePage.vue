<template>
  <section class="section">
    <div class="content">
      <h1 class="is-size-1">{{ $t('pages.profile.title') }}</h1>
      <table class="table is-bordered is-striped">
        <tbody class="som-recap">
          <tr>
            <th>{{ $t('pages.profile.email') }}</th>
            <td>{{ localUser.email }}</td>
          </tr>
          <tr v-if="proposals.length > 0">
            <th>{{ $t('pages.profile.proposals') }}</th>
            <td>
              <ul>
                <li v-for="proposal in proposals" :key="proposal.id">
                  <router-link
                    class="navbar-item" :to="{
                      name: 'proposal',
                      params: {id: proposal.project_id}
                    }">[{{proposal.project_id}}] {{proposal.title}}</router-link>
                </li>
              </ul>
            </td>
          </tr>
          <tr v-if="allocatedProposals.length > 0">
            <th>{{ $t('pages.profile.proposals_allocated') }}</th>
            <td>
              <ul>
                <li v-for="proposal in allocatedProposals" :key="proposal.id">
                  <router-link
                    class="navbar-item" :to="{
                      name: 'proposal',
                      params: {id: proposal.project_id}
                    }">
                    [{{proposal.project_id}}] {{proposal.title}}
                  </router-link>
                </li>
              </ul>
            </td>
          </tr>
          <tr v-if="allocatedSignoffProposals.length > 0">
            <th>{{ $t('pages.profile.proposals_allocated_signoff') }}</th>
            <td>
              <ul>
                <li v-for="proposal in allocatedSignoffProposals" :key="proposal.id">
                  <router-link
                    class="navbar-item" :to="{
                      name: 'proposal',
                      params: {id: proposal.project_id}
                    }">
                    [{{proposal.project_id}}] {{proposal.title}}
                  </router-link>
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
  import { computed } from 'vue'
  import { useUser } from '@/store/user.js'
  const { getUserInfo, localUser } = useUser()

  const proposals = computed(() => {
    return getUserInfo.proposals_users.map((el) => el.proposals)
  })
  const allocatedProposals = computed(() => {
    return getUserInfo.allocations.map((el) => el.proposals)
  })
  const allocatedSignoffProposals = computed(() => {
    return getUserInfo.allocations_signoff.map((el) => el.proposals)
  })
  /*
  const challenges = computed(() => {
    return getUserInfo.challenges_users.map((el) => el.challenges)
  })
  */
</script>
