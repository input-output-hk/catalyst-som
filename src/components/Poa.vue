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
            <poa-reviews :poa="poa" :reviews="poa.poas_reviews" />
          </td>
        </tr>
        <tr v-if="locked">
          <th>Signed off at:</th>
          <td>
            {{$d(poa.signoffs[0].created_at, 'long')}}
          </td>
        </tr>
      </tbody>
    </table>
    <div class="block buttons">
      <o-button
        v-if="current && !locked"
        size="medium"
        variant="primary"
        @click="newReviewVisible = !newReviewVisible">
          Submit review for this PoA
        </o-button>
        <div v-if="current && canSignoff && !locked">
          <o-button
            variant="primary"
            size="medium"
            @click="confirmSignoff = !confirmSignoff">
            Signoff
          </o-button>
          <o-modal v-model:active="confirmSignoff">
            <new-signoff :som="som" :poa="poa" @clear-signoff="confirmSignoff = false" />
          </o-modal>
        </div>
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
import { ref, computed } from 'vue'
import PoaReviews from '@/components/PoaReviews.vue'
import NewPoaReview from '@/components/NewPoaReview.vue'
import NewSignoff from '../components/NewSignoff.vue'
const props = defineProps(['poa', 'proposal', 'current', 'som'])
import { useUser } from '@/store/user.js'
const { canWriteSom, canWriteSomReview, canSignoff } = useUser()

const newReviewVisible = ref(false)
const confirmSignoff = ref(false)

const locked = computed(() => {
  return props.poa.signoffs.length
})

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
