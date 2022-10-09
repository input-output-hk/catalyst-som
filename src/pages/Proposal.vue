<template>
  <div class="content">
    <div class="col-6 form-widget">
      <h1>{{proposal.title}}</h1>
      <h3>{{proposal.project_id}}</h3>
    </div>
    <o-tabs type="boxed">
      <o-tab-item v-for="ml in [...Array(5).keys()]">
        <template #header>
          <span>Milestone {{ml + 1}}</span>
        </template>
        <milestone :proposal="proposal" :milestone="ml + 1" />
      </o-tab-item>
    </o-tabs>
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
