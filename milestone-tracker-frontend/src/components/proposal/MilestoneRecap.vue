<template>
  <div class="tile is-ml is-parent" v-if="som">
    <div class="tile is-child notification">
      <h1 class="title is-size-1 mb-2">
        <router-link :to="{name: 'proposal-milestones-detail', params: {id: proposal.project_id, milestone: milestone}}">
          {{ $t('milestone_recap.title', {nr: milestone}) }}
        </router-link>
      </h1>
      <approval-counters
        :approves="somReviewsApproved"
        :not-approves="somReviewsNotApproved" />
      <p class="is-size-4 mb-2 has-text-weight-semibold">{{som.title}}</p>
      <p class="is-size-6 mb-0">{{ $t('milestone_recap.cost') }}</p>
      <p class="is-size-4 mb-2 has-text-weight-semibold">
        {{$n(som.cost, 'currency')}}
      </p>
      <p class="is-size-6 mb-0">{{ $t('milestone_recap.delivery') }}</p>
      <p class="is-size-4 has-text-weight-semibold">
        {{ $t('milestone_recap.month', {month: som.month}) }}
      </p>
      <div class="is-tile is-child notification is-info ml-0">
        <p class="is-size-5 mb-4 has-text-weight-semibold">
          {{ $t('milestone_recap.payment') }}
        </p>
        <ul>
          <li v-for="payment,idx in payments">
            <span class="is-size-6 has-text-weight-semibold">
              {{$n(payment, 'currency')}} - Month {{ $t('milestone_recap.month', {month: parseInt(previousSomEnd) + idx + 1}) }}
            </span>
          </li>
        </ul>
        <p class="is-size-7 mb-0" v-if="milestone > 1">{{ $t('milestone_recap.payment_starts') }}</p>
        <p class="is-size-7 mb-0" v-if="milestone === 5">{{ $t('milestone_recap.last_payment') }}</p>
      </div>
      <div v-if="poa">
        <p class="is-size-3 mb-0 has-text-weight-semibold">{{ $t('milestone_recap.poa') }}</p>
        <approval-counters
          :approves="poaReviewsApproved"
          :not-approves="poaReviewsNotApproved" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch, toRef } from 'vue'
import ApprovalCounters from '@/components/reviews/ApprovalCounters.vue'

const props = defineProps(['milestone', 'proposal'])
import { useSoms } from '@/store/soms.js'
const { getSomsPreview, proposal_previews } = useSoms()

import { useSomReviewsCounters } from '@/composables/useSomReviewsCounters.js'
import { usePoaReviewsCounters } from '@/composables/usePoaReviewsCounters.js'

const som = computed(() => {
  try {
    return proposal_previews[props.proposal.id][props.milestone][0]
  } catch {
    return false
  }
})

const poa = computed(() => {
  try {
    return som.value.poas[0]
  } catch {
    return false
  }
})

const { somReviewsApproved, somReviewsNotApproved } = useSomReviewsCounters(som)
const { poaReviewsApproved, poaReviewsNotApproved } = usePoaReviewsCounters(poa)

watch(props, () => getSomsPreview(props.proposal.id, props.milestone))

const previousSomEnd = computed(() => {
  if (proposal_previews[props.proposal.id]) {
    let counter = props.milestone -1
    let previousSom = false
    while (counter > 0 && !previousSom) {
      if (proposal_previews[props.proposal.id][counter]) {
        previousSom = proposal_previews[props.proposal.id][counter][0]
      }
      counter--
    }
    if (previousSom) {
      return previousSom.month
    }
  }
  return 0
})

const payments = computed(() => {
  const times = Math.max(1, som.value.month - previousSomEnd.value)
  const unit = som.value.cost / times
  return [...Array(times).keys()].map(() => unit)
})

</script>

<style lang="scss" scoped>
$primary: #133FF0;
.is-ml:nth-child(1) {
  & > .notification {
    background: change-color($primary, $lightness: 96%);
  }
}
.is-ml:nth-child(2) {
  & > .notification {
    background: change-color($primary, $lightness: 94%);
  }
}
.is-ml:nth-child(3) {
  & > .notification {
    background: change-color($primary, $lightness: 92%);
  }
}
.is-ml:nth-child(4) {
  & > .notification {
    background: change-color($primary, $lightness: 88%);
  }
}
.is-ml:nth-child(5) {
  & > .notification {
    background: change-color($primary, $lightness: 82%);
  }
}
</style>
