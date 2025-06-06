<template>
  <div v-if="som" class="tile is-ml is-parent">
    <div class="tile is-child notification">
      <h1 class="title is-size-1 mb-2">
        <router-link :to="{name: 'proposal-milestones-detail', params: {id: proposal.project_id, milestone: milestone.milestone}}">
          <span v-if="milestone.milestone !== proposal.milestones_qty">{{ $t('milestone_recap.title', {nr: milestone.milestone}) }}</span>
          <span v-if="milestone.milestone === proposal.milestones_qty">{{ $t('milestone_recap.final_title') }}</span>
        </router-link>
      </h1>
      <approval-counters
        :approved="milestone.som_signoff_count > 0"
        :approves="somReviewsApproved"
        :not-approves="somReviewsNotApproved" />
      <p class="is-size-4 mb-2 has-text-weight-semibold">{{som.title}}</p>
      <p class="is-size-6 mb-0">{{ $t('milestone_recap.cost') }}</p>
      <p class="is-size-4 mb-2 has-text-weight-semibold">
        {{$n(som.cost, 'currency', { currency: proposal.currency })}}
      </p>
      <p class="is-size-6 mb-0">{{ $t('milestone_recap.delivery') }}</p>
      <p class="is-size-4 has-text-weight-semibold">
        {{ $t('milestone_recap.month', {month: som.month}) }} - {{ $d(literalMonth, 'month_only') }}
      </p>
      <div class="is-tile is-child notification is-info ml-0">
        <p class="is-size-5 mb-4 has-text-weight-semibold">
          {{ $t('milestone_recap.payment') }}
        </p>
        <ul>
          <li v-if="milestone.previous_poa_payment > 0">
            <span class="is-size-6 has-text-weight-semibold">
              {{$n(milestone.previous_poa_payment, 'currency', { currency: proposal.currency })}} - {{ $t('milestone_recap.payment_month_poa', {n: startingMonth - 1, m: milestone.milestone - 1}) }}
            </span>
          </li>
          <li v-for="x, i in Array.from({length: milestone.duration})" :key="i">
            <span class="is-size-6 has-text-weight-semibold">
              {{$n(milestone.monthly_payment, 'currency', { currency: proposal.currency })}} - 
              <span v-if="milestone.milestone === proposal.milestones_qty && (i + 1) === milestone.duration">
                {{ $t('milestone_recap.payment_month', startingMonth + i) }}
              </span>
              <span v-else>{{ $t('milestone_recap.payment_month', startingMonth + i - 1) }}</span>
            </span>
            <span v-if="milestone.milestone === proposal.milestones_qty && (i + 1) === milestone.duration" class="is-size-7 mb-0"> ({{ $t('milestone_recap.last_payment') }})</span>
          </li>
        </ul>
        <p v-if="milestone.milestone > 1 && milestone.milestone !== proposal.milestones_qty" class="is-size-7 mb-0">{{ $t('milestone_recap.payment_starts') }}</p>
      </div>
      <div v-if="poa">
        <p class="is-size-3 mb-0 has-text-weight-semibold">{{ $t('milestone_recap.poa') }}</p>
        <approval-counters
          :approved="milestone.poa_signoff_count > 0"
          :approves="poaReviewsApproved"
          :not-approves="poaReviewsNotApproved" />
        <signoff-recap :signoffs="poa.signoffs" />
      </div>
    </div>
  </div>
  <div v-else class="tile is-ml is-parent">
    <div class="tile is-child notification is-light">
      <h1 class="title is-size-1 mb-2">
        <span v-if="milestone.milestone !== proposal.milestones_qty">{{ $t('milestone.planned_milestone', {nr: milestone.milestone}) }}</span>
        <span v-if="milestone.milestone === proposal.milestones_qty">{{ $t('milestone_recap.final_title') }}</span>
      </h1>
      <div class="content">
        <p class="is-size-6 has-text-grey">{{ $t('milestone.planned_milestone_description') }}</p>
        <div class="has-text-centered mt-4">
          <o-icon icon="clock" size="large" variant="grey" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { storeToRefs } from 'pinia'
import ApprovalCounters from '@/components/shared/ApprovalCounters.vue'
import SignoffRecap from '@/components/proposal/SignoffRecap.vue'

const props = defineProps({
  milestone: {
    type: Object,
    default: () => {}
  },
  proposal: {
    type: Object,
    default: () => {}
  }
})
import { useSoms } from '@/store/soms.js'
const _useSoms = useSoms()
const { getSomsPreview } = _useSoms
const { proposal_previews } = storeToRefs(_useSoms)

import { useSomReviewsCounters } from '@/composables/useSomReviewsCounters.js'
import { usePoaReviewsCounters } from '@/composables/usePoaReviewsCounters.js'

const som = computed(() => {
  try {
    return proposal_previews.value[props.proposal.id][props.milestone.milestone][0]
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

onMounted(() => {
  getSomsPreview(props.proposal.id, props.milestone.milestone)
})

const startingMonth = computed(() => {
  if (props.milestone) {
    return props.milestone.progress - props.milestone.duration + 1
  }
  return 0
})

const literalMonth = computed(() => {
  if (props.milestone) {
    const startDate = new Date(props.proposal.starting_date)
    return new Date(startDate.setMonth(startDate.getMonth() + parseInt(som.value.month)))
  }
  return ''
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
