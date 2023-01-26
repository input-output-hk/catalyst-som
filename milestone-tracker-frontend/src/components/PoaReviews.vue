<template>
  <div class="content">
    <div v-if="poaReviewsTot > 0">
      <approval-counters
        :approves="poaReviewsApproved"
        :not-approves="poaReviewsNotApproved" />
      <o-collapse v-model:open="reviewsVisible">
        <template #trigger="props">
          <o-button size="small" variant="primary">
            {{ $t(
              'poa_reviews.poa_reviews',
              {
                action: (props.open) ? $t('poa_reviews.close') : $t('poa_reviews.open')
              })
            }}
          </o-button>
        </template>
        <div v-for="review in reviews" :key="review.id" class="reviews mt-3">
          <poa-review :review="review" />
        </div>
      </o-collapse>
    </div>
    <div v-if="poaReviewsTot === 0">
      {{ $t('poa_reviews.no_reviews') }}
    </div>
  </div>
</template>

<script setup>
import { ref, toRef } from 'vue'
const componentProps = defineProps({
  poa: {
    type: Object,
    default: () => {}
  },
  reviews: {
    type: Array,
    default: () => []
  }
})
import { usePoaReviewsCounters } from '@/composables/usePoaReviewsCounters.js'

const {
  poaReviewsApproved,
  poaReviewsNotApproved,
  poaReviewsTot
} = usePoaReviewsCounters(toRef(componentProps, 'poa'))

const reviewsVisible = ref(false)

</script>

<script>
import PoaReview from '@/components/PoaReview.vue'
import ApprovalCounters from '@/components/reviews/ApprovalCounters.vue'
</script>
