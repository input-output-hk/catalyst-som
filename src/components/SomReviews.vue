<template>
  <div class="content">
    <div v-if="tot > 0">
      {{ approves }} approvals<br />
      {{ notApproves }}  not approvals<br />
      <o-button
        class="is-small"
        @click="reviewsVisible = !reviewsVisible">
        Open <i>{{property}}</i> reviews
      </o-button>
      <o-modal v-model:active="reviewsVisible">
        <div class="reviews" v-for="review in reviews">
          <som-review :review="review" :properties="[property]" />
        </div>
      </o-modal>
    </div>
    <div v-if="tot === 0">
      No <i>{{property}}</i> reviews
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
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
