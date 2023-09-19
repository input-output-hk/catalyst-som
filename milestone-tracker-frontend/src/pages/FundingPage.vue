<template>
  <section class="section">
    <div class="content">
      <h1 class="is-size-1">{{ $t('pages.funding.title') }}</h1>
      <section :key="f" v-for="f in funds" class="mb-6">
        <h4>Fund {{ f }}</h4>
        <o-button
            variant="primary"
            size="medium"
            @click="exportProposals(f)"
          >
            {{ $t('pages.funding.export_proposals') }}
          </o-button>
          <o-button
            variant="primary"
            size="medium"
            @click="exportPoaReviews(f, 100)"
          >
            {{ $t('pages.funding.export_poa_reviews') }}
          </o-button>
        </section>
    </div>
  </section>
</template>

<script setup>
  
import { ref } from 'vue'
import { useProposals } from '@/store/proposals.js'
import { useUsers } from '@/store/users.js'
import {
  preparePaymentsData,
  prepareReviewsPaymentsData
 } from '@/utils/payments.js'
import downloadCsv from '@/utils/exportCsv.js'

const proposalsStore = useProposals()
const {
  getProposalsSnapshot
} = proposalsStore

const { getSubmittedPoaReviews } = useUsers()

const funds = ref(['Fund 9', 'Fund 10'])

const exportProposals = async (fund) => {
  const soms = await getProposalsSnapshot(fund)
  const data = preparePaymentsData(soms)
  downloadCsv(data)
}

const exportPoaReviews = async (
  fund,
  rewardPerReview,
  _from = '1970-01-01T00:00:00.000Z',
  _to = '2024-01-01T00:00:00.000Z'
) => {
  const reviews = await getSubmittedPoaReviews(fund, _from, _to)
  const reviewsPayment = prepareReviewsPaymentsData(reviews, fund, rewardPerReview)
  downloadCsv(reviewsPayment)
}


</script>
