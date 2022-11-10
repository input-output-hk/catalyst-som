<template>
  <section class="section">
    <div class="content">
      <div class="columns">
        <div class="column is-8">
          <h1 class="is-size-1">Proposals</h1>
          <p>All the proposals in the Statement of Milestone pilot.</p>
        </div>
        <div class="column is-4 has-text-right">
          <o-button
            variant="primary"
            size="small"
            v-if="isAdmin"
            @click="exportCSV"
          >
            Export CSV
          </o-button>
        </div>
      </div>
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
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import ProposalRow from '@/components/ProposalRow.vue'
import PaginatedTable from '@/components/PaginatedTable.vue'
import { prepareDataForExport, formatDataForExport } from '@/utils/exportProposals.js'
import { useProposals } from '@/store/proposals.js'
const proposalsStore = useProposals()
const { getProposals, getCount, getProposalsForExport, getSomsById } = proposalsStore
const { proposals } = storeToRefs(proposalsStore)

import { useUser } from '@/store/user.js'
const { isAdmin } = useUser()

const exportProposals = async () => {
  const soms = await getProposalsForExport()
  let ids = await getSomsById(soms.map((el) => el.id))
  formatDataForExport(await prepareDataForExport(soms, ids))
}

onMounted(async () => {
  exportProposals()
})

</script>

<style lang="scss" scoped>
.small-col {
  width: 4rem;
}
</style>
