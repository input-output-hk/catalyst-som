<template>
  <div class="tile is-4 is-parent">
    <div class="tile is-child notification primary" v-if="som">
      <h1 class="title is-size-1 mb-2">M {{milestone}}</h1>
      <approval-counters :approves="approves" :not-approves="notApproves" />
      <p class="is-size-3 mb-2 has-text-weight-semibold">{{som.title}}</p>
      <p class="is-size-6 mb-0">Milestone cost:</p>
      <p class="is-size-3 mb-2 has-text-weight-semibold">{{$n(som.cost, 'currency')}}</p>
      <p class="is-size-6 mb-0">Delivery on:</p>
      <p class="is-size-3 has-text-weight-semibold">Month {{som.month}}</p>
      <div class="mb-6" v-if="poa">
        <p class="is-size-2 mb-0 has-text-weight-semibold">PoA:</p>
        <approval-counters :approves="poaApproves" :not-approves="poaNotApproves" />
      </div>
      <p class="is-size-4 mb-0 has-text-weight-semibold">Payments schedule:</p>
      <ul>
        <li v-for="payment,idx in payments">
          <span class="is-size-5 has-text-weight-semibold">{{$n(payment, 'currency')}} - Month {{parseInt(previousSomEnd) + idx + 1}}</span>
        </li>
      </ul>
      <p class="is-size-7 mb-0" v-if="milestone > 1">Payments starts after previous milestone PoA approval.</p>
      <p class="is-size-7 mb-0" v-if="milestone === 5">Last payment occurs after Project Closeout approval.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import ApprovalCounters from '@/components/reviews/ApprovalCounters.vue'

const props = defineProps(['milestone', 'proposal'])
import { useSoms } from '@/store/soms.js'
const { getSomsPreview, proposal_previews } = useSoms()

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
  const times = som.value.month - previousSomEnd.value
  const unit = som.value.cost / times
  return [...Array(times).keys()].map(() => unit)
})

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


const boolKeys = ['outputs', 'success_criteria', 'evidence']
const approves = computed(() => {
  if (som.som_reviews) {
    return som.som_reviews.filter((r) => {
      let result = true
      boolKeys.forEach((el) => {
        result = result && r[`${el}_approves`]
      })
      return result
    }).length
  }
  return 0
})
const notApproves = computed(() => {
  if (som.som_reviews) {
    return som.som_reviews.length - approves.value
  }
  return 0
})

const poaApproves = computed(() => {
  if (poa.value.poas_reviews) {
    return poa.value.poas_reviews.filter((r) => r['content_approved']).length
  }
  return 0
})

const poaNotApproves = computed(() => {
  if (poa.value.poas_reviews) {
    return poa.value.poas_reviews.length - poaApproves.value
  }
  return 0
})

</script>
