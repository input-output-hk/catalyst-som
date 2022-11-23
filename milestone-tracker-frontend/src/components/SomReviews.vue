<template>
  <div class="content">
    <div v-if="somReviewsTot > 0">
      <approval-counters
        :approves="somReviewsApproved"
        :not-approves="somReviewsNotApproved" />
      <o-collapse v-model:open="reviewsVisible">
        <template #trigger="props">
          <o-button size="small" variant="primary">{{ (props.open) ? 'Close' : 'Open'}} <i>{{property}}</i> reviews</o-button>
        </template>
        <div class="reviews mt-3" v-for="review in som.som_reviews">
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
const props = defineProps(['som', 'property'])

const {
  somReviewsApproved,
  somReviewsNotApproved,
  somReviewsTot
} = useSomReviewsCounters(toRef(props, 'som'), toRef(props, 'property'))

const reviewsVisible = ref(false)
</script>

<script>
import SomReview from '@/components/SomReview.vue'
import ApprovalCounters from '@/components/reviews/ApprovalCounters.vue'
</script>
