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
          <!-- <tr>
            <th>{{ $t('pages.profile.username') }}</th>
            <td>{{ localUser.username }}</td>
          </tr> -->
          <tr>
            <th>{{ $t('pages.profile.role') }}</th>
            <td>{{ role }}</td>
          </tr>
          <tr>
            <th>{{ $t('pages.profile.proposals') }}</th>
            <td>
              <ul>
                <li v-for="proposal in proposals" :key="proposal.id">
                  <router-link
                    class="navbar-item" :to="{
                      name: 'proposal',
                      params: {id: proposal.project_id}
                    }">{{proposal.title}}</router-link>
                </li>
              </ul>
            </td>
          </tr>
          <!--
          <tr>
            <th>{{ $t('pages.profile.challenges') }}</th>
            <td>
              <ul>
                <li v-for="challenge in challenges" :key="challenge.id">
                  {{challenge.title}}
                </li>
              </ul>
            </td>
          </tr>
          -->
          <tr>
            <th>{{ $t('pages.profile.proposals_allocated') }}</th>
            <td>
              <ul>
                <li v-for="proposal in allocatedProposals" :key="proposal.id">
                  <router-link
                    class="navbar-item" :to="{
                      name: 'proposal',
                      params: {id: proposal.project_id}
                    }">
                    {{proposal.title}}
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
  import { roles } from '@/utils/roles.js'
  const { getUserInfo, localUser } = useUser()

  const role = computed(() => roles[getUserInfo.role])
  const proposals = computed(() => {
    return getUserInfo.proposals_users.map((el) => el.proposals)
  })
  const allocatedProposals = computed(() => {
    return getUserInfo.allocations.map((el) => el.proposals)
  })
  /*
  const challenges = computed(() => {
    return getUserInfo.challenges_users.map((el) => el.challenges)
  })
  */
</script>
