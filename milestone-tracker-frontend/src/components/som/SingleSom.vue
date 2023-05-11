<template>
  <div class="content mb-0">
    <section v-if="som" class="section">
      <table class="table is-bordered is-striped">
        <tbody class="som-recap">
          <tr>
            <th>{{ $t('som.submitted_at') }}</th>
            <td>{{ $d(som.created_at, 'long') }}</td>
            <td v-if="somReviewsVisible"></td>
          </tr>
          <tr>
            <th>{{ $t('som.title') }}</th>
            <td class="som-title"><span class="is-size-5 has-text-weight-semibold">{{som.title}}</span></td>
            <td v-if="somReviewsVisible"></td>
          </tr>
          <tr v-for="criterium in criteria" :key="criterium">
            <th>{{ $t(`som.${criterium}`) }}</th>
            <td :class="`som-${criterium}`" class="html-text" v-html="$sanitize(som[criterium])"></td>
            <td v-if="somReviewsVisible">
              <som-reviews
                :som="som"
                :reviews="activeSomReviews" :property="criterium" />
            </td>
          </tr>
          <tr>
            <th>{{ $t('som.month') }}</th>
            <td class="som-month">
              <span class="is-size-3 mr-4 has-text-weight-semibold">{{som.month}}</span>
            </td>
            <td v-if="somReviewsVisible"></td>
          </tr>
          <tr>
            <th>{{ $t('som.cost') }}</th>
            <td>
              <div class="is-flex is-align-items-center">
                <span class="is-size-3 mr-4 has-text-weight-semibold">{{somCost}}%</span>
                <progress class="progress is-primary is-medium" :value="somCost" max="100">{{somCost}}%</progress>
              </div>
              <div class="som-cost">
                <span class="is-size-3 mr-4 has-text-weight-semibold">{{$n(som.cost, 'currency')}}</span>
              </div>
            </td>
            <td v-if="somReviewsVisible"></td>
          </tr>
          <tr>
            <th>{{ $t('som.completion') }}</th>
            <td class="som-completion">
              <div class="is-flex is-align-items-center">
                <span class="is-size-3 mr-4 has-text-weight-semibold">{{som.completion}}%</span>
                <progress class="progress is-primary is-medium" :value="som.completion" max="100">{{som.completion}}%</progress>
              </div>
            </td>
            <td v-if="somReviewsVisible"></td>
          </tr>
          <tr v-if="locked">
            <th>{{ $t('som.signed_off_at') }}</th>
            <td>
              {{$d(som.signoffs[0].created_at, 'long')}}
            </td>
            <td v-if="somReviewsVisible"></td>
          </tr>
        </tbody>
      </table>
    </section>
    <div v-if="som">
      <section class="section pt-0 pb-0">
        <div v-if="som.som_reviews.length > 0" class="columns">
          <div class="column is-12">
            <o-button
              class="is-small show-som-reviews mr-3"
              @click="reviewsVisible = !reviewsVisible">
              {{ $t('som.open_reviews') }}
            </o-button>
            <o-button
              v-if="archivedSomReviews.length > 0"
              class="is-small show-som-reviews"
              @click="archivedReviewsVisible = !archivedReviewsVisible">
              {{ $t('som.open_archived_reviews') }}
            </o-button>
            <o-modal class="som-reviews-popup" :active="reviewsVisible" scroll="keep">
              <div class="container scrollable-modal">
                <div v-for="review in activeSomReviews" :key="review.id" class="reviews">
                  <som-review
                    class="mb-6"
                    :review="review"
                    :properties="['outputs', 'success_criteria', 'evidence']" />
                </div>
              </div>
            </o-modal>
            <o-modal
              v-if="archivedSomReviews.length > 0"
              class="som-reviews-popup"
              :active="archivedReviewsVisible"
              scroll="keep"
            >
              <div class="container scrollable-modal">
                <div class="card">
                  <div class="card-content">{{ $t('som.archived_reviews') }}</div>
                  <div v-for="review in archivedSomReviews" :key="review.id" class="reviews">
                    <som-review
                      class="mb-6"
                      :review="review"
                      :properties="['outputs', 'success_criteria', 'evidence']" />
                  </div>
                </div>
              </div>
            </o-modal>
          </div>
        </div>
      </section>
      <section v-if="current" class="section">
        <!--<h3 class="subtitle">SoM Actions</h3>-->
        <div class="block buttons">
          <div v-if="canWriteSomReview(proposal.id, proposal.challenge_id) && current && !locked" class="mr-4">
            <o-button
              class="new-som-review-button"
              variant="primary"
              size="medium"
              @click="_handleSomReviewSubmission()">
              {{ (currentUserReviewSubmission) ? $t('som.resubmit_review') : $t('som.submit_review') }}
            </o-button>
            <o-modal v-model:active="confirmSomReviewResubmission">
              <resubmission-confirm
                :title="$t('som_review.resubmission_title')"
                :msg="$t('som_review.resubmission_msg')"
                :confirm-msg="$t('som_review.resubmission_confirm')"
                :clear-msg="$t('som_review.resubmission_clear')"
                @clear-confirm="confirmSomReviewResubmission = false"
                @confirm="_handleSomReviewResubmission()"
              />
            </o-modal>
          </div>
          <div v-if="current && canWriteSom(proposal.id) && locked && !poaLocked" class="mr-4">
            <o-button
              class="new-poa"
              variant="primary"
              size="medium"
              @click="newPoAVisible = !newPoAVisible">
              {{ $t('som.submit_poa') }}
            </o-button>
            <o-modal v-model:active="newPoAVisible" class="new-poa-popup" >
              <new-poa :proposal="proposal" :som="som" :milestone="som.milestone" />
            </o-modal>
          </div>
          <div v-if="current && canSignoff && !locked">
            <o-button
              class="new-som-signoff"
              variant="primary"
              size="medium"
              @click="confirmSignoff = !confirmSignoff">
              {{ $t('som.signoff') }}
            </o-button>
            <o-modal v-model:active="confirmSignoff">
              <new-signoff :som="som" @clear-signoff="confirmSignoff = false" />
            </o-modal>
          </div>
        </div>
      </section>
      <section v-if="newReviewVisible" class="section pt-0">
        
        <new-som-review
          :som="som"
          @som-review-submitted="newReviewVisible = false" />
      </section>
      <div v-if="som.poas.length > 0" class="columns">
        <div class="column is-12">
          <poa-list :som="som" :poas="som.poas" :proposal="proposal" :submittable-poa="current && canWriteSom(proposal.id) && locked && !poaLocked" />
        </div>
      </div>
    </div>
    <section v-if="!som" class="section">
      <div class="notification">
        <span class="is-size-4">{{$t('som.not_submitted')}}</span>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useUser } from '@/store/user.js'
import useEventsBus from '@/eventBus'
const props = defineProps({
  som: {
    type: [Object, Boolean],
    default: false
  },
  proposal: {
    type: Object,
    default: () => {}
  },
  current: {
    type: [Object, Boolean],
    default: () => {}
  }
})
const { canWriteSom, canWriteSomReview, canSignoff } = useUser()

const { bus } = useEventsBus()

const reviewsVisible = ref(false)
const archivedReviewsVisible = ref(false)
const newReviewVisible = ref(false)
const confirmSomReviewResubmission = ref(false)
const newPoAVisible = ref(false)
const confirmSignoff = ref(false)
const criteria = ref(['outputs', 'success_criteria', 'evidence'])

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

const somReviewsVisible = computed(() => {
  return props.som.som_reviews.length > 0
})

const currentUserReviewSubmission = computed(() => {
  if (somReviewsVisible.value) {
    const currentUserReview = props.som.som_reviews.find(review => review.user_id === useUser().user.id)
    return (currentUserReview)
  }
  return false
})

const activeSomReviews = computed(() => {
  return props.som.som_reviews.filter(review => review.current)
})

const archivedSomReviews = computed(() => {
  return props.som.som_reviews.filter(review => !review.current)
})

const _handleSomReviewResubmission = () => {
  confirmSomReviewResubmission.value = false
  newReviewVisible.value = true
}

const _handleSomReviewSubmission = () => {
  if (newReviewVisible.value) {
    newReviewVisible.value = false
  } else {
    if (currentUserReviewSubmission.value) {
      confirmSomReviewResubmission.value = true
    } else {
      newReviewVisible.value = true
    }
  }
}

watch(()=>bus.value.get('getSomsBus'), () => {
  newPoAVisible.value = false
})

</script>

<script>
import SomReview from '@/components/som/SomReview.vue'
import SomReviews from '@/components/som/SomReviews.vue'
import NewSomReview from '@/components/forms/NewSomReview.vue'
import NewPoa from '@/components/forms/NewPoa.vue'
import PoaList from '@/components/poa/PoaList.vue'
import NewSignoff from '@/components/forms/NewSignoff.vue'
import ResubmissionConfirm from '@/components/proposal/ResubmissionConfirm.vue'
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
