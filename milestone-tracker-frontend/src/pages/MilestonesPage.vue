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
              {{ $t('pages.milestones.back') }}
            </router-link>
          </p>
        </div>
        <div class="column is-6">
          <proposal-recap :proposal="proposal" :snapshot="snapshot" />
        </div>
      </div>
    </section>
    <div v-if="proposal.milestones_qty" class="content columns is-multiline">
      <div class="column is-12 milestones-wrapper">
        <o-tabs v-model="activeTab" type="boxed">
          <o-tab-item v-for="ml in [...Array(proposal.milestones_qty).keys()]" :key="`ml-${ml + 1}`">
            <template
              #header>
              <span v-if="ml + 1 !== proposal.milestones_qty">{{ $t('pages.milestones.milestone', {nr: ml + 1}) }}</span>
              <span v-if="ml + 1 === proposal.milestones_qty">{{ $t('pages.milestones.final_milestone') }}</span>
            </template>
            <single-milestone :proposal="proposal" :milestone="ml + 1" @refresh-recap="refreshRecap" />
          </o-tab-item>
        </o-tabs>
      </div>
    </div>
    <proposal-thread :proposal="proposal" class="proposal-threads" />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router';
import { useProposals } from '../store/proposals.js'
const { getProposal, getProposalSnapshot } = useProposals()

const proposal = ref({})
const snapshot = ref([])

const router = useRouter()

const proposalId = computed(() => {
  return router.currentRoute.value.params.id;
})

/*
const noOfMilestones = computed(() => {
  if (proposal.value.milestones_qty) {
    return [1,2]
  } else {
    return []
  }
})
*/

const activeTab = computed({
  get() {
    const current = parseInt(router.currentRoute.value.params.milestone)
    return (current) ? current : 1
  },
  set(value) {
    router.push({
      name: 'proposal-milestones-detail',
      params: {
        id: proposalId.value,
        milestone: value
      }
    })
  }
})

const refreshRecap = async () => {
  snapshot.value = await getProposalSnapshot(proposalId.value)
}

onMounted(async () => {
  proposal.value = await getProposal(proposalId.value)
  snapshot.value = await getProposalSnapshot(proposalId.value)
})


</script>

<script>
import SingleMilestone from '@/components/proposal/SingleMilestone.vue'
import ProposalRecap from '@/components/proposal/ProposalRecap.vue'
import ProposalThread from '@/components/threads/ProposalThread.vue'
</script>

<style lang="scss">
.milestones-wrapper {
  .b-tabs .tab-content {
    padding: 1rem 0.2rem !important;
  }
}
.proposal-threads {
  position: fixed;
  bottom: 0;
  left: 30px;
  width: 600px;
  max-width: 80%;
  z-index: 1000;
}
</style>
