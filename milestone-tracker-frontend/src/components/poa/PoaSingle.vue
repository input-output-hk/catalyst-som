<template>
  <div class="content">
    <table v-if="poa" class="table is-bordered is-striped poa-table">
      <tbody class="poa-recap">
        <tr>
          <th>{{ $t('poa.poa') }}</th>
          <td>
            <div class="poa-content html-text" v-html="$sanitize(poa.content)"></div>
          </td>
        </tr>
        <tr>
          <th>{{ $t('poa.submitted_at') }}</th>
          <td>{{$d(poa.created_at, 'long')}}</td>
        </tr>
        <tr v-if="poa.poas_reviews.length > 0">
          <th>{{ $t('poa.reviews') }}</th>
          <td>
            <poa-reviews :poa="poa" :reviews="poa.poas_reviews" :approved="locked > 0" />
          </td>
        </tr>
        <tr v-if="locked">
          <th class="has-background-success has-text-white">{{ $t('poa.signed_off_at') }}</th>
          <td class="has-background-success has-text-white">
            {{$d(poa.signoffs[0].created_at, 'long')}}
          </td>
        </tr>
      </tbody>
    </table>
    <div class="block buttons">
      <o-button
        v-if="canWriteSomReview(proposal.id, proposal.challenge_id) && current && !locked"
        class="new-poa-review-button"
        size="medium"
        variant="primary"
        @click="_handlePoaReviewSubmission()">
          {{ (currentUserReviewSubmission) ? $t('poa.resubmit') : $t('poa.submit') }}
        </o-button>
        <o-modal
          v-if="canWriteSomReview(proposal.id, proposal.challenge_id) && current && !locked"
          v-model:active="confirmPoaReviewResubmission"
        >
          <resubmission-confirm
            :title="$t('poa_review.resubmission_title')"
            :msg="$t('poa_review.resubmission_msg')"
            :confirm-msg="$t('poa_review.resubmission_confirm')"
            :clear-msg="$t('poa_review.resubmission_clear')"
            :entity="'poa-review'"
            @clear-confirm="confirmPoaReviewResubmission = false"
            @confirm="_handlePoaReviewResubmission()"
          />
        </o-modal>
        <div v-if="current && canSignoff && !locked">
          <o-button
            variant="primary"
            size="medium"
            @click="confirmSignoff = !confirmSignoff">
            {{ $t('poa.signoff') }}
          </o-button>
          <o-modal v-model:active="confirmSignoff">
            <new-signoff :som="som" :poa="poa" @clear-signoff="confirmSignoff = false" />
          </o-modal>
        </div>
    </div>
    <section
      v-if="canWriteSomReview(proposal.id, proposal.challenge_id) && current && !locked && newReviewVisible"
      class="section pr-0 pl-0">
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
import PoaReviews from '@/components/poa/PoaReviews.vue'
import NewPoaReview from '@/components/forms/NewPoaReview.vue'
import NewSignoff from '@/components/forms/NewSignoff.vue'
import ResubmissionConfirm from '@/components/proposal/ResubmissionConfirm.vue'

const props = defineProps({
  poa: {
    type: Object,
    default: () => {}
  },
  proposal: {
    type: Object,
    default: () => {}
  },
  current: {
    type: Boolean,
    default: false
  },
  som: {
    type: Object,
    default: () => {}
  },
})
import { useUser } from '@/store/user.js'
const { canWriteSomReview, canSignoff } = useUser()

const newReviewVisible = ref(false)
const confirmSignoff = ref(false)
const confirmPoaReviewResubmission = ref(false)

const locked = computed(() => {
  return props.poa.signoffs.length
})

const currentUserReviewSubmission = computed(() => {
  if (props.poa.poas_reviews.length > 0) {
    const currentUserReview = props.poa.poas_reviews.find(review => review.user_id === useUser().user.id)
    return (currentUserReview)
  }
  return false
})

const _handlePoaReviewResubmission = () => {
  confirmPoaReviewResubmission.value = false
  newReviewVisible.value = true
}

const _handlePoaReviewSubmission = () => {
  if (newReviewVisible.value) {
    newReviewVisible.value = false
  } else {
    if (currentUserReviewSubmission.value) {
      confirmPoaReviewResubmission.value = true
    } else {
      newReviewVisible.value = true
    }
  }
}

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
