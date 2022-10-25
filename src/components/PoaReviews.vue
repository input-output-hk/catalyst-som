<template>
  <div class="content">
    <div v-if="tot > 0">
      {{ approves }} approvals<br />
      {{ notApproves }}  not approvals<br />
      <o-button
        class="is-small"
        @click="reviewsVisible = !reviewsVisible">
        Open reviews
      </o-button>
      <o-modal v-model:active="reviewsVisible">
        <div class="modal-card scrollable-modal">
          <div class="reviews" v-for="review in reviews">
            <poa-review :review="review" />
          </div>
        </div>
      </o-modal>
    </div>
    <div v-if="tot === 0">
      No reviews
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
