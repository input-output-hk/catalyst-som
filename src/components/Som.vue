<template>
  <div class="content">
    <div class="box" v-if="som">
      <div class="columns">
        <div class="column is-2">Title</div>
        <div class="column is-10">{{som.title}}</div>
      </div>
      <div class="columns">
        <div class="column is-2">Outputs</div>
        <div class="column is-6">{{som.outputs}}</div>
        <div class="column is-4">
          <som-reviews
            v-if="som.som_reviews.length > 0"
            :reviews="som.som_reviews" :property="'outputs'" />
        </div>
      </div>
      <div class="columns">
        <div class="column is-2">Success criteria</div>
        <div class="column is-6">{{som.success_criteria}}</div>
        <div class="column is-4">
          <som-reviews
            v-if="som.som_reviews.length > 0"
            :reviews="som.som_reviews" :property="'success_criteria'" />
        </div>
      </div>
      <div class="columns">
        <div class="column is-2">Evidence</div>
        <div class="column is-6">{{som.evidence}}</div>
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
        <div class="column is-6">{{som.cost}}</div>
      </div>
      <div class="columns">
        <div class="column is-2">Completion</div>
        <div class="column is-6">{{som.completion}}%</div>
      </div>
      <div class="columns">
        <div class="column is-2">Submitted at</div>
        <div class="column is-6">{{$d(som.created_at)}}</div>
      </div>
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
      <div class="columns" v-if="canWriteSomReview(proposal.id, proposal.challenge_id) && current">
        <div class="column is-12">
          <o-button
            @click="newReviewVisible = !newReviewVisible">
            New review for this Milestone
          </o-button>
          <new-som-review :som="som" v-if="newReviewVisible" />
        </div>
      </div>
      <div class="columns" v-if="current && canWriteSom(proposal.id)">
        <div class="column is-12">
          <o-button
            @click="newPoAVisible = !newPoAVisible">
            Submit new PoA
          </o-button>
          <o-modal v-model:active="newPoAVisible">
            <new-poa :proposal="proposal" :som="som" />
          </o-modal>
        </div>
      </div>
      <div class="columns" v-if="som.poas.length > 0">
        <div class="column is-12">
          <poas :poas="som.poas" :proposal="proposal" />
        </div>
      </div>
    </div>
    <div class="box" v-if="!som">
      Statement of Milestone not set!
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
const props = defineProps(['som', 'proposal', 'current'])
import { useUser } from '../store/user.js'
const { canWriteSom, canWriteSomReview } = useUser()

import useEventsBus from '../eventBus'
const { bus } = useEventsBus()

const reviewsVisible = ref(false)
const newReviewVisible = ref(false)
const newPoAVisible = ref(false)

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
