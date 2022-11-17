<template>
  <div class="content mb-0">
    <section class="section" v-if="som">
      <table class="table is-bordered is-striped">
        <tbody class="som-recap">
          <tr>
            <th>SoM Submitted at</th>
            <td>{{$d(som.created_at, 'long')}}</td>
            <td></td>
          </tr>
          <tr>
            <th>Milestone Title</th>
            <td><span class="is-size-5 has-text-weight-semibold">{{som.title}}</span></td>
            <td></td>
          </tr>
          <tr>
            <th>Milestone Outputs</th>
            <td v-html="$sanitize(som.outputs)"></td>
            <td>
              <som-reviews
                v-if="som.som_reviews.length > 0"
                :som="som"
                :reviews="som.som_reviews" :property="'outputs'" />
            </td>
          </tr>
          <tr>
            <th>Acceptance criteria</th>
            <td v-html="$sanitize(som.success_criteria)"></td>
            <td>
              <som-reviews
                v-if="som.som_reviews.length > 0"
                :som="som"
                :reviews="som.som_reviews" :property="'success_criteria'" />
            </td>
          </tr>
          <tr>
            <th>Milestone Evidence</th>
            <td v-html="$sanitize(som.evidence)"></td>
            <td>
              <som-reviews
                v-if="som.som_reviews.length > 0"
                :som="som"
                :reviews="som.som_reviews" :property="'evidence'" />
            </td>
          </tr>
          <tr>
            <th>Delivery Month</th>
            <td>
              <span class="is-size-3 mr-4 has-text-weight-semibold">{{som.month}}</span>
            </td>
            <td></td>
          </tr>
          <tr>
            <th>Milestone Cost</th>
            <td>
              <div class="is-flex is-align-items-center">
                <span class="is-size-3 mr-4 has-text-weight-semibold">{{somCost}}%</span>
                <progress class="progress is-primary is-medium" :value="somCost" max="100">{{somCost}}%</progress>
              </div>
              <div>
                <span class="is-size-3 mr-4 has-text-weight-semibold">{{$n(som.cost, 'currency')}}</span>
              </div>
            </td>
            <td></td>
          </tr>
          <tr>
            <th>Project Completion</th>
            <td>
              <div class="is-flex is-align-items-center">
                <span class="is-size-3 mr-4 has-text-weight-semibold">{{som.completion}}%</span>
                <progress class="progress is-primary is-medium" :value="som.completion" max="100">{{som.completion}}%</progress>
              </div>
            </td>
            <td></td>
          </tr>
          <tr v-if="locked">
            <th>Signed off at:</th>
            <td>
              {{$d(som.signoffs[0].created_at, 'long')}}
            </td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </section>
    <div v-if="som">
      <section class="section pt-0 pb-0">
        <div class="columns" v-if="som.som_reviews.length > 0">
          <div class="column is-12">
            <o-button
              class="is-small"
              @click="reviewsVisible = !reviewsVisible">
              Open reviews for this Milestone
            </o-button>
            <o-modal :active="reviewsVisible" scroll="keep">
              <div class="container scrollable-modal">
                <div class="reviews" v-for="review in som.som_reviews">
                  <som-review
                    class="mb-6"
                    :review="review"
                    :properties="['outputs', 'success_criteria', 'evidence']" />
                </div>
              </div>
            </o-modal>
          </div>
        </div>
      </section>
      <section class="section" v-if="current">
        <!--<h3 class="subtitle">SoM Actions</h3>-->
        <div class="block buttons">
          <div class="mr-4" v-if="canWriteSomReview(proposal.id, proposal.challenge_id) && current && !locked">
            <o-button
              variant="primary"
              size="medium"
              @click="newReviewVisible = !newReviewVisible">
              Submit review for this SoM
            </o-button>
          </div>
          <div class="mr-4" v-if="current && canWriteSom(proposal.id) && locked && !poaLocked">
            <o-button
              variant="primary"
              size="medium"
              @click="newPoAVisible = !newPoAVisible">
              Submit new PoA
            </o-button>
            <o-modal v-model:active="newPoAVisible">
              <new-poa :proposal="proposal" :som="som" />
            </o-modal>
          </div>
          <div v-if="current && canSignoff && !locked">
            <o-button
              variant="primary"
              size="medium"
              @click="confirmSignoff = !confirmSignoff">
              Signoff
            </o-button>
            <o-modal v-model:active="confirmSignoff">
              <new-signoff :som="som" @clear-signoff="confirmSignoff = false" />
            </o-modal>
          </div>
        </div>
      </section>
      <section class="section pt-0" v-if="newReviewVisible">
        <new-som-review
          :som="som"
          @som-review-submitted="newReviewVisible = false" />
      </section>
      <div class="columns" v-if="som.poas.length > 0">
        <div class="column is-12">
          <poas :som="som" :poas="som.poas" :proposal="proposal" />
        </div>
      </div>
    </div>
    <section class="section" v-if="!som">
      <div class="notification">
        <span class="is-size-4">Statement of Milestone not submitted yet!</span>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
const props = defineProps(['som', 'proposal', 'current'])
import { useUser } from '../store/user.js'
const { canWriteSom, canWriteSomReview, canSignoff } = useUser()

import useEventsBus from '../eventBus'
const { bus } = useEventsBus()

const reviewsVisible = ref(false)
const newReviewVisible = ref(false)
const newPoAVisible = ref(false)
const confirmSignoff = ref(false)

const somCost = computed(() => {
  return ((props.som.cost * 100) / props.proposal.budget).toFixed(2)
})

const locked = computed(() => {
  return props.som.signoffs.length
})

const poaLocked = computed(() => {
  if (props.som.poas.length > 0) {
    return (props.som.poas[0].signoffs.length > 0)
  }
  return false
})

watch(()=>bus.value.get('getSomsBus'), (val) => {
  newPoAVisible.value = false
})

</script>

<script>
import { computed } from 'vue'
import SomReview from '../components/SomReview.vue'
import SomReviews from '../components/SomReviews.vue'
import NewSomReview from '../components/NewSomReview.vue'
import NewPoa from '../components/NewPoa.vue'
import Poas from '../components/Poas.vue'
import NewSignoff from '../components/NewSignoff.vue'

export default {
  components: {
    SomReview,
    SomReviews,
    NewSomReview,
    NewPoa,
    Poas,
    NewSignoff
  },
  computed: {
  }
}
</script>

<style lang="scss" scoped>
.som-recap {
  tr {
    td, th {
      &:nth-child(1) {
        width: 16%;
      }
      &:nth-child(2) {
        width: 52%;
      }
      &:nth-child(3) {
        width: 32%;
      }
    }
  }
}
</style>
