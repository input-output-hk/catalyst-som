<template>
  <div class="content">
    <div class="box">
      <div class="columns">
        <div class="column is-12" v-html="poa.content"></div>
      </div>
      <div class="columns">
        <div class="column is-3">Created at:</div>
        <div class="column is-9">{{$d(poa.created_at, 'long')}}</div>
      </div>
      <div class="columns" v-if="poa.poas_reviews.length > 0">
        <div class="column is-12">
          <poa-reviews :reviews="poa.poas_reviews" />
        </div>
      </div>
      <div class="columns" v-if="canWriteSomReview(proposal.id, proposal.challenge_id)">
        <div class="column is-12">
          <o-button
            @click="newReviewVisible = !newReviewVisible">
            New review for this PoA
          </o-button>
          <new-poa-review :poa="poa" v-if="newReviewVisible" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
const props = defineProps(['poa', 'proposal'])
import { useUser } from '../store/user.js'
const { canWriteSom, canWriteSomReview } = useUser()

const newReviewVisible = ref(false)

</script>

<script>
import { computed } from 'vue'
import PoaReviews from '../components/PoaReviews.vue'
import NewPoaReview from '../components/NewPoaReview.vue'

export default {
  components: {
    PoaReviews,
    NewPoaReview
  },
  computed: {
  }
}
</script>
