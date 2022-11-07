<template>
  <div class="content">
    <div v-if="tot > 0">
      <div class="tile is-ancestor mb-0">
        <div class="tile is-6 is-parent">
          <div class="tile is-child notification is-info">
            <h4 class="is-size-3 mr-4 has-text-weight-semibold mb-0">{{ approves }}</h4>approvals<br />
          </div>
        </div>
        <div class="tile is-6 is-parent">
          <div class="tile is-child notification is-danger">
            <h4 class="is-size-3 mr-4 has-text-weight-semibold mb-0 has-text-white">{{ notApproves }}</h4>refusals<br />
          </div>
        </div>
      </div>
      <o-collapse v-model:open="reviewsVisible">
        <template #trigger="props">
          <o-button size="small" variant="primary">{{ (props.open) ? 'Close' : 'Open'}} PoA reviews</o-button>
        </template>
        <div class="reviews mt-3" v-for="review in reviews">
          <poa-review :review="review" />
        </div>
      </o-collapse>
    </div>
    <div v-if="tot === 0">
      No PoA reviews
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
const props = defineProps(['reviews'])

const reviewsVisible = ref(false)

const boolKey = computed(() => `content_approved`)
const approves = computed(() => {
  if (props.reviews) {
    return props.reviews.filter((r) => r.content_approved).length
  }
  return 0
})
const notApproves = computed(() => {
  if (props.reviews) {
    return props.reviews.filter((r) => !r.content_approved).length
  }
  return 0
})
const tot = computed(() => approves.value + notApproves.value)

</script>

<script>
import { computed } from 'vue'
import PoaReview from '../components/PoaReview.vue'

export default {
  components: {
    PoaReview
  }
}
</script>
