<template>
  <div class="content">
    <div v-if="poaReviewsTot > 0">
      <approval-counters
        :approves="poaReviewsApproved"
        :not-approves="poaReviewsNotApproved" />
      <o-collapse v-model:open="reviewsVisible">
        <template #trigger="props">
          <o-button size="small" variant="primary">{{ (props.open) ? 'Close' : 'Open'}} PoA reviews</o-button>
        </template>
        <div class="reviews mt-3" v-for="review in reviews">
          <poa-review :review="review" />
        </div>
      </o-collapse>
    </div>
    <div v-if="poaReviewsTot === 0">
      No PoA reviews
    </div>
  </div>
</template>

<script setup>
import { ref, toRef } from 'vue'
const props = defineProps(['poa', 'reviews'])
import { usePoaReviewsCounters } from '@/composables/usePoaReviewsCounters.js'

const {
  poaReviewsApproved,
  poaReviewsNotApproved,
  poaReviewsTot
} = usePoaReviewsCounters(toRef(props, 'poa'))

const reviewsVisible = ref(false)

</script>

<script>
import PoaReview from '@/components/PoaReview.vue'
import ApprovalCounters from '@/components/reviews/ApprovalCounters.vue'
</script>
