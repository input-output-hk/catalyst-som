<template>
  <section class="section">
    <notification-list
      :title="$t('pages.notifications.som_to_review')"
      :items="somsToReview"
      :headers="headers"
      :no-items-msg="$t('pages.notifications.no_soms_to_review')"
      :row-msg="$t('pages.notifications.go_to_milestone')"
    />
    <notification-list
      :title="$t('pages.notifications.poa_to_review')"
      :items="poasToReview"
      :headers="headers"
      :no-items-msg="$t('pages.notifications.no_poas_to_review')"
      :row-msg="$t('pages.notifications.go_to_poa')"
    />
  </section>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useSoms } from '@/store/soms.js'
import { usePoas } from '@/store/poas.js'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const { getSomsByAllocation } = useSoms()
const { getPoasByAllocation } = usePoas()

const soms = ref([])
const poas = ref([])

const headers = ref([
  t('pages.notifications.proposal'),
  t('pages.notifications.milestone'),
  t('pages.notifications.submitted_at'),
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
})

</script>

<script>
import NotificationList from '@/components/notifications/NotificationList.vue'
</script>
