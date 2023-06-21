<template>
  <section class="section">
    <notification-list
      v-if="somsToReview.length"
      class="som-to-review-notifications"
      :row-component="NotificationRow"
      :title="$t('pages.notifications.som_to_review')"
      :items="somsToReview"
      :headers="headers"
      :row-msg="$t('pages.notifications.go_to_som')"
      :entity-type="'som'"
    />
    <notification-list
      v-if="poasToReview.length"
      class="poa-to-review-notifications"
      :row-component="NotificationRow"
      :title="$t('pages.notifications.poa_to_review')"
      :items="poasToReview"
      :headers="headers"
      :row-msg="$t('pages.notifications.go_to_poa')"
      :entity-type="'poa'"
    />
    <notification-list
      v-if="signoffs.length"
      class="signoff-received-notifications"
      :row-component="SignoffNotificationRow"
      :title="$t('pages.notifications.signoff_received', signoffsDays)"
      :items="signoffs"
      :headers="signoffHeaders"
      :row-msg="$t('pages.notifications.go_to_poa')"
    />
    <notification-list
      v-if="somReviews.length"
      class="som-reviews-received-notifications"
      :row-component="NotificationRow"
      :title="$t('pages.notifications.som_reviews_received')"
      :items="somReviews"
      :headers="headers"
      :row-msg="$t('pages.notifications.go_to_som')"
      :entity-type="'som'"
    />
    <notification-list
      v-show="poaReviews.length"
      class="poa-reviews-received-notifications"
      :row-component="NotificationRow"
      :title="$t('pages.notifications.poa_reviews_received')"
      :items="poaReviews"
      :headers="headers"
      :row-msg="$t('pages.notifications.go_to_poa')"
      :entity-type="'poa'"
    />
    <notification-list
      v-show="canSignoff"
      class="poa-to-signoff-received-notifications"
      :row-component="ToBeSignedOffRow"
      :title="$t('pages.notifications.poa_to_signoff_received')"
      :items="poasToSignoff"
      :headers="toSignoffHeaders"
      :row-msg="$t('pages.notifications.go_to_poa')"
      :entity-type="'poa'"
      :filters="toSignoffFilters"
      @applyFilter="handlePoasToSignoffFilters"
    />
    <notification-list
      v-show="canSignoff"
      class="som-to-signoff-received-notifications"
      :row-component="ToBeSignedOffRow"
      :title="$t('pages.notifications.som_to_signoff_received')"
      :items="somsToSignoff"
      :headers="toSignoffHeaders"
      :row-msg="$t('pages.notifications.go_to_som')"
      :entity-type="'som'"
      :filters="toSignoffFilters"
      @applyFilter="handleSomsToSignoffFilters"
    />
    <div v-if="notificationsCount === 0" class="tile is-ml is-parent">
      <div class="tile is-child notification is-info">
        <p>{{ $t('pages.notifications.no_notifications') }}</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { useUser } from '@/store/user.js'
import { useSoms } from '@/store/soms.js'
import { usePoas } from '@/store/poas.js'
const { t } = useI18n()

const { getSomsByAllocation } = useSoms()
const { getPoasByAllocation } = usePoas()
const {
  getSignoffNotifications,
  getSomReviewsNotifications,
  getPoaReviewsNotifications,
  getPoasToBeSignedOff,
  getSomsToBeSignedOff
} = useUser()
const userStore = useUser()
const { canSignoff } = storeToRefs(userStore)

const soms = ref([])
const poas = ref([])
const poaReviews = ref([])
const somReviews = ref([])
const signoffs = ref([])
const poasToSignoff = ref([])
const somsToSignoff = ref([])
const signoffsDays = ref(10)

const headers = ref([
  t('pages.notifications.proposal'),
  t('pages.notifications.milestone'),
  t('pages.notifications.submitted_at'),
  ''
])

const signoffHeaders = ref([
  t('pages.notifications.proposal'),
  t('pages.notifications.milestone'),
  t('pages.notifications.signedoff_at'),
  ''
])

const toSignoffHeaders = ref([
  t('pages.notifications.proposal'),
  t('pages.notifications.milestone'),
  t('pages.notifications.submitted_at'),
  t('pages.notifications.nr_reviews'),
  t('pages.notifications.nr_approvals'),
  ''
])

const toSignoffFilters = ref([
  {
    type: 'number',
    key: '_nr_reviews',
    name: t('pages.notifications.nr_reviews')
  },
  {
    type: 'number',
    key: '_nr_approvals',
    name: t('pages.notifications.nr_approvals')
  },
  {
    type: 'date',
    key: '_from',
    name: t('pages.notifications.from'),
  },
])

const somsToReview = computed(() => {
  return soms.value.filter(som => som.my_reviews_count === 0)
})

const poasToReview = computed(() => {
  return poas.value.filter(poa => poa.my_reviews_count === 0)
})

const notificationsCount = computed(() => {
  return (
    somsToReview.value.length +
    poasToReview.value.length +
    somReviews.value.length +
    poaReviews.value.length +
    signoffs.value.length + 
    poasToSignoff.value.length
  )
})

const handlePoasToSignoffFilters = async (params) => {
  if (canSignoff) {
    poasToSignoff.value = await getPoasToBeSignedOff(
      params._from, 
      params._nr_reviews || 0,
      params._nr_approvals || 0
    )
  }
}

const handleSomsToSignoffFilters = async (params) => {
  if (canSignoff) {
    somsToSignoff.value = await getSomsToBeSignedOff(
      params._from, 
      params._nr_reviews || 0,
      params._nr_approvals || 0
    )
  }
}

onMounted(async () => {
  soms.value = await getSomsByAllocation()
  poas.value = await getPoasByAllocation()
  const now = new Date()
  const from = new Date(now.setDate(now.getDate() - signoffsDays.value))
  signoffs.value = await getSignoffNotifications(from.toISOString())
  somReviews.value = await getSomReviewsNotifications()
  poaReviews.value = await getPoaReviewsNotifications()
  if (canSignoff) {
    poasToSignoff.value = await getPoasToBeSignedOff()
    somsToSignoff.value = await getSomsToBeSignedOff()
  }
})

</script>

<script>
import NotificationList from '@/components/notifications/NotificationList.vue'
import NotificationRow from '@/components/notifications/NotificationRow.vue'
import SignoffNotificationRow from '@/components/notifications/SignoffNotificationRow.vue'
import ToBeSignedOffRow from '@/components/notifications/ToBeSignedOffRow.vue'
</script>
