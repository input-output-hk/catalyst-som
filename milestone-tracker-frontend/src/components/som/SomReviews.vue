<template>
  <div class="content">
    <div v-if="somReviewsTot > 0">
      <approval-counters
        :approves="somReviewsApproved"
        :not-approves="somReviewsNotApproved" />
      <o-collapse v-model:open="reviewsVisible">
        <template #trigger="props">
          <o-button size="small" variant="primary">{{ (props.open) ? 'Close' : 'Open'}} <i>{{ $t(`som.${property}`) }}</i> reviews</o-button>
        </template>
        <div v-for="review in som.som_reviews" :key="review.id" class="reviews mt-3">
          <som-review :review="review" :properties="[property]" />
        </div>
      </o-collapse>
    </div>
    <div v-if="somReviewsTot === 0">
      No <i>{{property}}</i> reviews
    </div>
  </div>
</template>

<script setup>
import { ref, toRef } from 'vue'
import { useSomReviewsCounters } from '@/composables/useSomReviewsCounters.js'
const componentProps = defineProps({
  som: {
    type: Object,
    default: () => {}
  },
  property: {
    type: String,
    default: ''
  }
})

const {
  somReviewsApproved,
  somReviewsNotApproved,
  somReviewsTot
} = useSomReviewsCounters(toRef(componentProps, 'som'), toRef(componentProps, 'property'))

const reviewsVisible = ref(false)
</script>

<script>
import SomReview from '@/components/som/SomReview.vue'
import ApprovalCounters from '@/components/shared/ApprovalCounters.vue'
</script>
