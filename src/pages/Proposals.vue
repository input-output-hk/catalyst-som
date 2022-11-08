<template>
  <div class="content">
    <h1 class="is-size-1">Proposals</h1>
    <p>All the proposals in the Statement of Milestone pilot.</p>
    <paginated-table
      classStyle="proposals-list"
      :headers="['ID', 'Title', 'Challenge', 'Budget']"
      :items="proposals"
      :getItems="getProposals"
      :getCount="getCount"
      :itemComponent="ProposalRow"
    >
    </paginated-table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import ProposalRow from '@/components/ProposalRow.vue'
import PaginatedTable from '@/components/PaginatedTable.vue'
import { useProposals } from '../store/proposals.js'
const proposalsStore = useProposals()
const { getProposals, getCount } = proposalsStore
const { proposals } = storeToRefs(proposalsStore);

</script>

<style lang="scss" scoped>
.small-col {
  width: 4rem;
}
</style>
