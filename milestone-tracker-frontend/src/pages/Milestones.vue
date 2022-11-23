<template>
  <div>
    <section class="section">
      <div class="content columns is-multiline">
        <div class="column is-6">
          <h1 class="title is-size-1">{{proposal.title}}</h1>
          <p>
            <router-link
              v-if="proposal.project_id"
              :to="{name: 'proposal', params: {id: proposal.project_id}}">
              Go back to main proposal page.
            </router-link>
          </p>
        </div>
        <div class="column is-6">
          <recap :proposal="proposal" />
        </div>
      </div>
    </section>
    <div class="content columns is-multiline">
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
import Milestone from '@/components/Milestone.vue'
import Recap from '@/components/proposal/Recap.vue'
</script>

<style lang="scss">
.milestones-wrapper {
  .b-tabs .tab-content {
    padding: 1rem 0.2rem !important;
  }
}
</style>
