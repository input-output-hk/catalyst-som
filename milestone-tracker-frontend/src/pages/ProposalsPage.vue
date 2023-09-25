<template>
  <section class="section">
    <div class="content">
      <div class="columns">
        <div class="column is-8">
          <h1 class="is-size-1">{{ $t('pages.proposals.page_title') }}</h1>
          <p>{{ $t('pages.proposals.description') }}</p>
        </div>
        <div class="column is-4 has-text-right">
        </div>
      </div>
      <paginated-table
        class-style="proposals-list"
        :headers="dynamicHeaders"
        :items="proposals"
        :get-items="getProposals"
        :get-count="getCount"
        :item-component="ProposalRow"
      >
      </paginated-table>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useUser } from '@/store/user.js'
import ProposalRow from '@/components/proposal/ProposalRow.vue'
import PaginatedTable from '@/components/shared/PaginatedTable.vue'
import { useProposals } from '@/store/proposals.js'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const proposalsStore = useProposals()
const {
  getProposals,
  getCount
} = proposalsStore
const { canSetAllocations } = useUser()
const { proposals } = storeToRefs(proposalsStore)

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
