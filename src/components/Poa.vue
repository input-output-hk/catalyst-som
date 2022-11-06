<template>
  <div class="content">
    <table class="table is-bordered is-striped" v-if="poa">
      <tbody class="poa-recap">
        <tr>
          <th>PoA</th>
          <td>
            <div v-html="poa.content"></div>
          </td>
        </tr>
        <tr>
          <th>Submitted At:</th>
          <td>{{$d(poa.created_at, 'long')}}</td>
        </tr>
        <tr v-if="poa.poas_reviews.length > 0">
          <th>PoA reviews</th>
          <td>
            <poa-reviews :reviews="poa.poas_reviews" />
          </td>
        </tr>
      </tbody>
    </table>
    <o-button
      size="medium"
      variant="primary"
      @click="newReviewVisible = !newReviewVisible">
        New review for this PoA
      </o-button>
    <new-poa-review :poa="poa" v-if="newReviewVisible" />
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
