<template>
  <div class="content">
    <div v-if="poaReviewsTot > 0">
      <approval-counters
        :approved="approved"
        :approves="poaReviewsApproved"
        :not-approves="poaReviewsNotApproved" />
      <o-collapse v-model:open="reviewsVisible">
        <template #trigger="props">
          <o-button
            class="open-poa-reviews"
            size="small" variant="primary">
            {{ $t(
              'poa_reviews.poa_reviews',
              {
                action: (props.open) ? $t('poa_reviews.close') : $t('poa_reviews.open')
              })
            }}
          </o-button>
        </template>
        <div v-for="review in activeReviews" :key="review.id" class="reviews single-poa-review mt-3">
          <poa-review :review="review" />
        </div>
      </o-collapse>
      <o-collapse v-if="archivedReviews.length > 0" v-model:open="archivedReviewsVisible">
        <template #trigger="props">
          <o-button
            class="open-poa-reviews mt-2"
            size="small" variant="">
            {{ $t(
              'poa_reviews.poa_archived_reviews',
              {
                action: (props.open) ? $t('poa_reviews.close') : $t('poa_reviews.open')
              })
            }}
          </o-button>
        </template>
        <p class="mt-2">{{ $t('poa_reviews.archived_reviews') }}</p>
        <div v-for="review in archivedReviews" :key="review.id" class="reviews single-poa-review mt-3">
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
import { ref, toRef, computed } from 'vue'
import { usePoaReviewsCounters } from '@/composables/usePoaReviewsCounters.js'

const componentProps = defineProps({
  poa: {
    type: Object,
    default: () => {}
  },
  reviews: {
    type: Array,
    default: () => []
  },
  approved: {
    type: Boolean,
    default: false
  }
})

const {
  poaReviewsApproved,
  poaReviewsNotApproved,
  poaReviewsTot
} = usePoaReviewsCounters(toRef(componentProps, 'poa'))

const reviewsVisible = ref(false)
const archivedReviewsVisible = ref(false)

const activeReviews = computed(() => {
  try {
    return componentProps.reviews.filter(r => r.current)
  } catch {
    return []
  }
})

const archivedReviews = computed(() => {
  return componentProps.reviews.filter(r => !r.current)
})

</script>

<script>
import PoaReview from '@/components/poa/PoaReview.vue'
import ApprovalCounters from '@/components/shared/ApprovalCounters.vue'
</script>
