<template>
  <div class="content">
    <div v-if="tot > 0">
      <approval-counters :approves="approves" :not-approves="notApproves" />
      <o-collapse v-model:open="reviewsVisible">
        <template #trigger="props">
          <o-button size="small" variant="primary">{{ (props.open) ? 'Close' : 'Open'}} <i>{{property}}</i> reviews</o-button>
        </template>
        <div class="reviews mt-3" v-for="review in reviews">
          <som-review :review="review" :properties="[property]" />
        </div>
      </o-collapse>
    </div>
    <div v-if="tot === 0">
      No <i>{{property}}</i> reviews
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import ApprovalCounters from '@/components/reviews/ApprovalCounters.vue'
const props = defineProps(['reviews', 'property'])

const reviewsVisible = ref(false)

const boolKey = computed(() => `${props.property}_approves`)
const approves = computed(() => {
  if (props.reviews) {
    return props.reviews.filter((r) => r[boolKey.value]).length
  }
  return 0
})
const notApproves = computed(() => {
  if (props.reviews) {
    return props.reviews.filter((r) => !r[boolKey.value]).length
  }
  return 0
})
const tot = computed(() => approves.value + notApproves.value)

</script>

<script>
import { computed } from 'vue'
import SomReview from '../components/SomReview.vue'

export default {
  components: {
    SomReview
  }
}
</script>
