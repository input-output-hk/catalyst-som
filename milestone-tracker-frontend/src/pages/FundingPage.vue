<template>
  <section class="section">
    <div class="content">
      <h1 class="is-size-1">{{ $t('pages.funding.title') }}</h1>
      <section v-for="f in funds" :key="f"  class="mb-6">
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
            <div v-for="rule, idx in poaRewards[f]" :key="`poa-rewards-${idx}`" class="mb-5">
              <o-field :label="$t('pages.funding.rewards_per_poa')">
                <o-input
                  v-model="poaRewards[f][idx].amount"
                  class="number-input"
                  type="number"
                  size="small"
                />
                <o-input
                  v-model="poaRewards[f][idx].min"
                  class="number-input"
                  type="number"
                  size="small"
                />
                <o-input
                  v-model="poaRewards[f][idx].max"
                  class="number-input"
                  type="number"
                  size="small"
                />
              </o-field>
            </div>
            <o-button
              variant="primary"
              size="small"
              @click="exportPoaReviews(f, poaRewards[f])"
            >
              {{ $t('pages.funding.export_poa_reviews') }}
            </o-button>
          </div>
          <div class="column is-4">
            <div v-for="rule, idx in somRewards[f]" :key="`som-rewards-${idx}`" class="mb-5">
              <o-field :label="$t('pages.funding.rewards_per_som')">
                <o-input
                  v-model="somRewards[f][idx].amount"
                  class="number-input"
                  type="number"
                  size="small"
                />
                <o-input
                  v-model="somRewards[f][idx].min"
                  class="number-input"
                  type="number"
                  size="small"
                />
                <o-input
                  v-model="somRewards[f][idx].max"
                  class="number-input"
                  type="number"
                  size="small"
                />
              </o-field>
            </div>
            <o-button
              variant="primary"
              size="small"
              @click="exportSomReviews(f, somRewards[f])"
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
import { getFundIdFromName } from '@/utils/fund.js'

const proposalsStore = useProposals()
const {
  getProposalsSnapshot
} = proposalsStore

const {
  getSubmittedPoaReviews,
  getSubmittedSomReviews
} = useUsers()

const funds = ref(['Fund 9', 'Fund 10', 'Fund 11', 'Fund 12', 'Fund 13'])
const poaRewards = ref({
  'Fund 9': [
    {
      amount: 100,
      min: 0,
      max: 1000000
    }
  ],
  'Fund 10': [
    {
      amount: 200,
      min: 0,
      max: 150000
    },
    {
      amount: 250,
      min: 150000,
      max: 10000000
    }
  ],
  'Fund 11': [
    {
      amount: 200,
      min: 0,
      max: 150000
    },
    {
      amount: 250,
      min: 150000,
      max: 10000000
    }
  ],
  'Fund 12': [
    {
      amount: 200,
      min: 0,
      max: 150000
    },
    {
      amount: 250,
      min: 150000,
      max: 10000000
    }
  ],
  'Fund 13': [
    {
      amount: 200,
      min: 0,
      max: 150000
    },
    {
      amount: 250,
      min: 150000,
      max: 10000000
    }
  ]
})
const somRewards = ref({
  'Fund 9': [
    {
      amount: 100,
      min: 0,
      max: 1000000
    }
  ],
  'Fund 10': [
    {
      amount: 350,
      min: 0,
      max: 10000000
    }
  ],
  'Fund 11': [
    {
      amount: 200,
      min: 0,
      max: 150000
    },
    {
      amount: 250,
      min: 150000,
      max: 10000000
    }
  ],
  'Fund 12': [
    {
      amount: 200,
      min: 0,
      max: 150000
    },
    {
      amount: 250,
      min: 150000,
      max: 10000000
    }
  ],
  'Fund 13': [
    {
      amount: 0,
      min: 0,
      max: 150000
    },
    {
      amount: 0,
      min: 150000,
      max: 10000000
    }
  ]
})

const exportProposals = async (fund) => {
  const fundId = getFundIdFromName(fund)
  const soms = await getProposalsSnapshot(fund)
  const data = preparePaymentsData(soms, fundId)
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
