<template>
  <section class="section">
    <notification-list
      :row-component="NotificationRow"
      :title="$t('pages.notifications.som_to_review')"
      :items="somsToReview"
      :headers="headers"
      :no-items-msg="$t('pages.notifications.no_soms_to_review')"
      :row-msg="$t('pages.notifications.go_to_som')"
    />
    <notification-list
      :row-component="NotificationRow"
      :title="$t('pages.notifications.poa_to_review')"
      :items="poasToReview"
      :headers="headers"
      :no-items-msg="$t('pages.notifications.no_poas_to_review')"
      :row-msg="$t('pages.notifications.go_to_poa')"
    />
    <notification-list
      :row-component="SignoffNotificationRow"
      :title="$t('pages.notifications.signoff_received', signoffsDays)"
      :items="signoffs"
      :headers="signoffHeaders"
      :no-items-msg="$t('pages.notifications.no_poas_to_review')"
      :row-msg="$t('pages.notifications.go_to_poa')"
    />
    <notification-list
      :row-component="NotificationRow"
      :title="$t('pages.notifications.som_reviews_received')"
      :items="somReviews"
      :headers="headers"
      :no-items-msg="$t('pages.notifications.no_soms_to_review')"
      :row-msg="$t('pages.notifications.go_to_som')"
    />
    <notification-list
      :row-component="NotificationRow"
      :title="$t('pages.notifications.poa_reviews_received')"
      :items="poaReviews"
      :headers="headers"
      :no-items-msg="$t('pages.notifications.no_poas_to_review')"
      :row-msg="$t('pages.notifications.go_to_poa')"
    />
    <!--
     - SoM reviews received for current milestone
     - PoA reviews received for current milestone
    -->
  </section>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useUser } from '@/store/user.js'
import { useSoms } from '@/store/soms.js'
import { usePoas } from '@/store/poas.js'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const { getSomsByAllocation } = useSoms()
const { getPoasByAllocation } = usePoas()
const {
  getSignoffNotifications,
  getSomReviewsNotifications,
  getPoaReviewsNotifications
} = useUser()

const soms = ref([])
const poas = ref([])
const poaReviews = ref([])
const somReviews = ref([])
const signoffs = ref([])
const signoffsDays = ref(30)

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

const somsToReview = computed(() => {
  return soms.value.filter(som => som.my_reviews_count === 0)
})

const poasToReview = computed(() => {
  return poas.value.filter(poa => poa.my_reviews_count === 0)
})

onMounted(async () => {
  soms.value = await getSomsByAllocation()
  poas.value = await getPoasByAllocation()
  const now = new Date()
  const from = new Date(now.setDate(now.getDate() - signoffsDays.value))
  signoffs.value = await getSignoffNotifications(from.toISOString())
  somReviews.value = await getSomReviewsNotifications()
  poaReviews.value = await getPoaReviewsNotifications()
})

</script>

<script>
import NotificationList from '@/components/notifications/NotificationList.vue'
import NotificationRow from '@/components/notifications/NotificationRow.vue'
import SignoffNotificationRow from '@/components/notifications/SignoffNotificationRow.vue'
</script>
