<template>
  <div class="content columns is-multiline">
    <div class="column is-6">
      <h1 class="title is-size-1">{{proposal.title}}</h1>
    </div>
    <div class="column is-6">
      <table class="table is-bordered is-striped">
        <tbody>
          <tr>
            <th>Proposal ID</th>
            <td>{{proposal.project_id}}</td>
          </tr>
          <tr>
            <th>Link</th>
            <td>
              <a :href="proposal.url" target="_blank">Open in Ideascale</a>
            </td>
          </tr>
          <tr>
            <th>Challenge</th>
            <td>
              <span v-if="proposal.challenges">
                {{proposal.challenges.title}}
              </span>
            </td>
          </tr>
          <tr>
            <th>Budget</th>
            <td>
              <span v-if="proposal.budget">
                {{ $n(proposal.budget, "currency") }}
              </span>
            </td>
          </tr>
          <tr>
            <th>Completion date</th>
            <td>
              <span v-if="proposal.completion_date">
                {{ $d(proposal.completion_date) }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="column is-12 milestones-wrapper">
      <o-tabs type="boxed">
        <o-tab-item v-for="ml in [...Array(5).keys()]">
          <template #header>
            <span>Milestone {{ml + 1}}</span>
          </template>
          <milestone :proposal="proposal" :milestone="ml + 1" />
        </o-tab-item>
      </o-tabs>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router';
import { useProposals } from '../store/proposals.js'
const { getProposal } = useProposals()

const proposal = ref({})
const proposalId = computed(() => {
  return useRouter().currentRoute.value.params.id;
})

onMounted(async () => {
  proposal.value = await getProposal(proposalId.value)
})

</script>

<script>
import { computed } from 'vue'
import Milestone from '../components/Milestone.vue'

export default {
  components: {
    Milestone
  }
}
</script>

<style lang="scss">
.milestones-wrapper {
  .b-tabs .tab-content {
    padding: 1rem 0.2rem !important;
  }
}
</style>
