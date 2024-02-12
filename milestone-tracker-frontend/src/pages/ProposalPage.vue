<template>
  <section class="section">
    <div class="content columns is-multiline">
      <div class="column is-6">
        <h1 class="title is-size-1">{{proposal.title}}</h1>
        <router-link
          v-if="proposal.project_id"
          v-slot="{ navigate }"
          :to="{name: 'proposal-milestones', params: {id: proposal.project_id}}">
          <o-button variant="primary" size="large" @click="navigate">
            {{ $t('pages.proposal.open_details') }}
          </o-button>
        </router-link>
        <next-payment :payment="payment" :proposal="proposal" />
      </div>
      <div class="column is-6">
        <proposal-recap :proposal="proposal" :snapshot="snapshot" />
      </div>
      
      <div class="column is-12">
        <h3 class="title is-size-2">{{ $t('pages.proposal.milestone_recap') }}</h3>
        <milestones-recap :proposal="proposal" :durations="durations" />
      </div>
      <div class="column is-12">
        <router-link
          v-if="proposal.project_id"
          v-slot="{ navigate }"
          :to="{name: 'proposal-milestones', params: {id: proposal.project_id}}">
          <o-button variant="primary" size="large" @click="navigate">
            {{ $t('pages.proposal.open_details') }}
          </o-button>
        </router-link>
      </div>
    </div>
    <proposal-thread :proposal="proposal" class="proposal-threads" />
  </section>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router';
import { useProposals } from '@/store/proposals.js'
import {
  generateMilestoneDuration,
  getCurrentMilestone,
  getNextPayment
} from '@/utils/milestones.js'
import { getShortNameFromId } from '@/utils/fund'
const { getProposal, getProposalSnapshot } = useProposals()

const proposal = ref({})
const snapshot = ref([])
const proposalId = computed(() => {
  return useRouter().currentRoute.value.params.id;
})

const currentFundId = computed(() => {
  if (proposal.value) {
    if (proposal.value.challenges) {
      return proposal.value.challenges.fund_id
    }
  }
  return 1
})

const durations = computed(() => {
  const fund = getShortNameFromId(currentFundId.value)
  return generateMilestoneDuration(snapshot.value, fund)
})

const currentExecuting = computed(() => {
  return getCurrentMilestone(durations.value)
})

const payment = computed(() => {
  const fund = getShortNameFromId(currentFundId.value)
  return getNextPayment(durations.value, currentExecuting.value, fund)
})

onMounted(async () => {
  proposal.value = await getProposal(proposalId.value)
  snapshot.value = await getProposalSnapshot(proposalId.value)
})

</script>

<script>
import ProposalRecap from '@/components/proposal/ProposalRecap.vue'
import MilestonesRecap from '@/components/proposal/MilestonesRecap.vue'
import nextPayment from '@/components/proposal/NextPayment.vue'
import ProposalThread from '@/components/threads/ProposalThread.vue'
</script>

<style lang="scss">
.proposal-threads {
  position: fixed;
  bottom: 0;
  left: 30px;
  width: 600px;
  max-width: 80%;
  z-index: 1000;
}
</style>