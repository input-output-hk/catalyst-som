<template>
  <section class="section">
    <div class="content columns is-multiline">
      <div class="column is-6">
        <h1 class="title is-size-1">{{proposal.title}}</h1>
        <router-link
          v-if="proposal.project_id"
          v-slot="{href, route, navigate}"
          :to="{name: 'proposal-milestones', params: {id: proposal.project_id}}">
          <o-button variant="primary" size="large" @click="navigate">
            {{ $t('pages.proposal.open_details') }}
          </o-button>
        </router-link>
      </div>
      <div class="column is-6">
        <recap :proposal="proposal" />
      </div>
      <div class="column is-12">
        <h3 class="title is-size-2">{{ $t('pages.proposal.milestone_recap') }}</h3>
        <milestones-recap :proposal="proposal" />
      </div>
      <div class="column is-12">
        <router-link
          v-if="proposal.project_id"
          v-slot="{href, route, navigate}"
          :to="{name: 'proposal-milestones', params: {id: proposal.project_id}}">
          <o-button variant="primary" size="large" @click="navigate">
            {{ $t('pages.proposal.open_details') }}
          </o-button>
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router';
import { useProposals } from '@/store/proposals.js'
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
import Recap from '@/components/proposal/Recap.vue'
import MilestonesRecap from '@/components/MilestonesRecap.vue'
</script>
