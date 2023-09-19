<template>
  <section class="section">
    <div class="content">
      <div class="columns">
        <div class="column is-8">
          <h1 class="is-size-1">{{ $t('pages.proposals.page_title') }}</h1>
          <p>{{ $t('pages.proposals.description') }}</p>
        </div>
        <div class="column is-4 has-text-right">
          <o-button
            v-if="isAdmin"
            variant="primary"
            size="small"
            @click="exportCSV"
          >
            {{ $t('pages.proposals.export') }}
          </o-button>
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
import { useUsers } from '@/store/users.js'
import ProposalRow from '@/components/proposal/ProposalRow.vue'
import PaginatedTable from '@/components/shared/PaginatedTable.vue'
import {
  preparePaymentsData,
  prepareReviewsPaymentsData
 } from '@/utils/payments.js'
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
const { getSubmittedPoaReviews } = useUsers()
const { proposals } = storeToRefs(proposalsStore)


const exportCSV = async () => {
  const reviews = await getSubmittedPoaReviews('1970-01-01T00:00:00.000Z', '2024-01-01T00:00:00.000Z')
  const reviewsPayment = prepareReviewsPaymentsData(reviews, '10', 100)
  console.log(reviewsPayment)
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
