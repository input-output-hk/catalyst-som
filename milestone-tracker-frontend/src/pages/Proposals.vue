<template>
  <section class="section">
    <div class="content">
      <div class="columns">
        <div class="column is-8">
          <h1 class="is-size-1">{{ $t('pages.proposals.title') }}</h1>
          <p>{{ $t('pages.proposals.description') }}</p>
        </div>
        <div class="column is-4 has-text-right">
          <o-button
            variant="primary"
            size="small"
            v-if="isAdmin"
            @click="exportCSV"
          >
            {{ $t('pages.proposals.export') }}
          </o-button>
        </div>
      </div>
      <paginated-table
        classStyle="proposals-list"
        :headers="dynamicHeaders"
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
import { ref, onMounted, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useUser } from '@/store/user.js'
import ProposalRow from '@/components/ProposalRow.vue'
import PaginatedTable from '@/components/PaginatedTable.vue'
import {
  preparePaymentsData
 } from '@/utils/exportProposals.js'
import downloadCsv from '@/utils/exportCsv.js'
import { useProposals } from '@/store/proposals.js'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const proposalsStore = useProposals()
const {
  getProposals,
  getCount,
  getProposalsSnapshot
} = proposalsStore
const { isAdmin, canSetAllocations } = useUser()
const { proposals } = storeToRefs(proposalsStore)


const exportCSV = async () => {
  const soms = await getProposalsSnapshot()
  const data = preparePaymentsData(soms)
  downloadCsv(data)
}

const dynamicHeaders = computed(() => {
  const base = [
    t('pages.proposals.id'),
    t('pages.proposals.title'),
    t('pages.proposals.challenge'),
    t('pages.proposals.budget')
  ]
  if (canSetAllocations) {
    base.push(t('pages.proposals.allocations'))
  }
  return base
})

</script>

<style lang="scss" scoped>
.small-col {
  width: 4rem;
}
</style>
<style lang="scss">
.proposals-list {
  th:nth-child(5) {
    width: 400px;
  }
}
</style>
