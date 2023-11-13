<template>
  <section class="section">
    <div class="content">
      <h1 class="is-size-1">{{ $t('pages.funding.title') }}</h1>
      <section :key="f" v-for="f in funds" class="mb-6">
        <h3>{{ f }}</h3>
        <div class="columns">
          <div class="column is-4">
            <o-button
              variant="primary"
              size="medium"
              @click="exportProposals(f)"
            >
              {{ $t('pages.funding.export_proposals') }}
            </o-button>
          </div>
          <div class="column is-4">
            <o-field :label="$t('pages.funding.rewards_per_poa')">
              <o-input
                v-model="rewards[f]"
                class="number-input"
                type="number"
              />
            </o-field>
            <o-button
              variant="primary"
              size="medium"
              @click="exportPoaReviews(f, rewards[f])"
            >
              {{ $t('pages.funding.export_poa_reviews') }}
            </o-button>
          </div>
          <div class="column is-4">
            <o-field :label="$t('pages.funding.rewards_per_som')">
              <o-input
                v-model="rewards[f]"
                class="number-input"
                type="number"
              />
            </o-field>
            <o-button
              variant="primary"
              size="medium"
              @click="exportSomReviews(f, rewards[f])"
            >
              {{ $t('pages.funding.export_som_reviews') }}
            </o-button>
          </div>
        </div>
          
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

const {
  getSubmittedPoaReviews,
  getSubmittedSomReviews
} = useUsers()

const funds = ref(['Fund 9', 'Fund 10'])
const rewards = ref({
  'Fund 9': 100,
  'Fund 10': 100
})

const exportProposals = async (fund) => {
  const soms = await getProposalsSnapshot(fund)
  const data = preparePaymentsData(soms)
  downloadCsv(data)
}

const exportPoaReviews = async (
  fund,
  rewardPerReview,
  _from = '1970-01-01T00:00:00.000Z',
  _to = '2025-01-01T00:00:00.000Z'
) => {
  const reviews = await getSubmittedPoaReviews(fund, _from, _to)
  const reviewsPayment = prepareReviewsPaymentsData(reviews, fund, rewardPerReview, 'poa')
  downloadCsv(reviewsPayment)
}

const exportSomReviews = async (
  fund,
  rewardPerReview,
  _from = '1970-01-01T00:00:00.000Z',
  _to = '2025-01-01T00:00:00.000Z'
) => {
  const reviews = await getSubmittedSomReviews(fund, _from, _to)
  const reviewsPayment = prepareReviewsPaymentsData(reviews, fund, rewardPerReview, 'som')
  downloadCsv(reviewsPayment)
}


</script>
