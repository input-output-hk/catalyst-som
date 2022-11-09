<template>
  <div class="content">
    <table class="table is-bordered is-striped poa-table" v-if="poa">
      <tbody class="poa-recap">
        <tr>
          <th>PoA</th>
          <td>
            <div v-html="$sanitize(poa.content)"></div>
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
    <div class="block buttons">
      <o-button
        v-if="current"
        size="medium"
        variant="primary"
        @click="newReviewVisible = !newReviewVisible">
          Submit review for this PoA
        </o-button>
    </div>
    <section class="section pr-0 pl-0" v-if="newReviewVisible">
      <new-poa-review
        :som="som"
        :poa="poa"
        @poa-review-submitted="newReviewVisible = false"
      />
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import PoaReviews from '@/components/PoaReviews.vue'
import NewPoaReview from '@/components/NewPoaReview.vue'
const props = defineProps(['poa', 'proposal', 'current', 'som'])
import { useUser } from '@/store/user.js'
const { canWriteSom, canWriteSomReview } = useUser()

const newReviewVisible = ref(false)

</script>

<style lang="scss" scoped>
.poa-table {
  tr {
    td, th {
      &:nth-child(1) {
        width: 30%;
      }
      &:nth-child(2) {
        width: 70%;
      }
    }
  }
}
</style>
