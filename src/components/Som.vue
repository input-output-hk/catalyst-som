<template>
  <div class="content">
    <table class="table is-bordered is-striped" v-if="som">
      <tbody class="som-recap">
        <tr>
          <th>Milestone Title</th>
          <td><span class="is-size-5 has-text-weight-semibold">{{som.title}}</span></td>
          <td></td>
        </tr>
        <tr>
          <th>Milestone Outputs</th>
          <td v-html="som.outputs"></td>
          <td>
            <som-reviews
              v-if="som.som_reviews.length > 0"
              :reviews="som.som_reviews" :property="'outputs'" />
          </td>
        </tr>
        <tr>
          <th>Acceptance criteria</th>
          <td v-html="som.success_criteria"></td>
          <td>
            <som-reviews
              v-if="som.som_reviews.length > 0"
              :reviews="som.som_reviews" :property="'success_criteria'" />
          </td>
        </tr>
        <tr>
          <th>Milestone Evidence</th>
          <td v-html="som.evidence"></td>
          <td>
            <som-reviews
              v-if="som.som_reviews.length > 0"
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
        <tr>
          <th>SoM Submitted at</th>
          <td>{{$d(som.created_at, 'long')}}</td>
          <td></td>
        </tr>
      </tbody>
    </table>
    <div class="box" v-if="false">
      <div class="columns">
        <div class="column is-2">Title</div>
        <div class="column is-10">{{som.title}}</div>
      </div>
      <div class="columns">
        <div class="column is-2">Outputs</div>
        <div class="column is-6" v-html="som.outputs"></div>
        <div class="column is-4">
          <som-reviews
            v-if="som.som_reviews.length > 0"
            :reviews="som.som_reviews" :property="'outputs'" />
        </div>
      </div>
      <div class="columns">
        <div class="column is-2">Acceptance criteria</div>
        <div class="column is-6" v-html="som.success_criteria"></div>
        <div class="column is-4">
          <som-reviews
            v-if="som.som_reviews.length > 0"
            :reviews="som.som_reviews" :property="'success_criteria'" />
        </div>
      </div>
      <div class="columns">
        <div class="column is-2">Evidence</div>
        <div class="column is-6" v-html="som.evidence"></div>
        <div class="column is-4">
          <som-reviews
            v-if="som.som_reviews.length > 0"
            :reviews="som.som_reviews" :property="'evidence'" />
        </div>
      </div>
      <div class="columns">
        <div class="column is-2">Month</div>
        <div class="column is-6">{{som.month}}</div>
      </div>
      <div class="columns">
        <div class="column is-2">Cost</div>
        <div class="column is-6">{{$n(som.cost, 'currency')}}</div>
      </div>
      <div class="columns">
        <div class="column is-2">Completion</div>
        <div class="column is-6">{{som.completion}}%</div>
      </div>
      <div class="columns">
        <div class="column is-2">Submitted at</div>
        <div class="column is-6">{{$d(som.created_at, 'long')}}</div>
      </div>
    </div>
    <div v-if="som">
      <div class="columns" v-if="som.som_reviews.length > 0">
        <div class="column is-12">
          <o-button
            class="is-small"
            @click="reviewsVisible = !reviewsVisible">
            Open reviews for this Milestone
          </o-button>
          <o-modal :active="reviewsVisible" scroll="keep">
            <div class="modal-card scrollable-modal">
              <div class="reviews" v-for="review in som.som_reviews">
                <som-review
                  :review="review"
                  :properties="['outputs', 'success_criteria', 'evidence']" />
              </div>
            </div>
          </o-modal>
        </div>
      </div>
      <section class="section pr-0 pl-0" v-if="current">
        <h3 class="subtitle">Actions</h3>
        <div class="block buttons">
          <div class="mr-4" v-if="canWriteSomReview(proposal.id, proposal.challenge_id) && current">
            <o-button
              variant="primary"
              size="medium"
              @click="newReviewVisible = !newReviewVisible">
              Submit review for this SoM
            </o-button>
          </div>
          <div v-if="current && canWriteSom(proposal.id)">
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
        </div>
      </section>
      <section class="section pr-0 pl-0" v-if="newReviewVisible">
        <new-som-review
          :som="som"
          @som-review-submitted="newReviewVisible = false" />
      </section>
      <div class="columns" v-if="som.poas.length > 0">
        <div class="column is-12">
          <poas :poas="som.poas" :proposal="proposal" />
        </div>
      </div>
    </div>
    <div class="notification" v-if="!som">
      <span class="is-size-4">Statement of Milestone not submitted yet!</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
const props = defineProps(['som', 'proposal', 'current'])
import { useUser } from '../store/user.js'
const { canWriteSom, canWriteSomReview } = useUser()

import useEventsBus from '../eventBus'
const { bus } = useEventsBus()

const reviewsVisible = ref(false)
const newReviewVisible = ref(false)
const newPoAVisible = ref(false)

const somCost = computed(() => {
  return (props.som.cost * 100) / props.proposal.budget
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

export default {
  components: {
    SomReview,
    SomReviews,
    NewSomReview,
    NewPoa,
    Poas
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
