<template>
  <section class="section">
    <notification-list
      v-show="canSetAllocations || canSignoff"
      class="poa-to-signoff-received-notifications"
      :row-component="ToBeSignedOffRow"
      :title="$t('pages.notifications.latest_poa_received')"
      :items="poasToSignoff"
      :headers="toSignoffHeaders"
      :row-msg="$t('pages.notifications.go_to_latest_poa')"
      :entity-type="'poa'"
      :filters="toSignoffFilters"
      @apply-filter="handlePoasToSignoffFilters"
    />
    <notification-list
      v-show="canSetAllocations || canSignoff"
      class="som-to-signoff-received-notifications"
      :row-component="ToBeSignedOffRow"
      :title="$t('pages.notifications.latest_som_received')"
      :items="somsToSignoff"
      :headers="toSignoffHeaders"
      :row-msg="$t('pages.notifications.go_to_latest_som')"
      :entity-type="'som'"
      :filters="toSignoffFilters"
      @apply-filter="handleSomsToSignoffFilters"
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
const { t } = useI18n()

const {
  getPoasToBeSignedOff,
  getSomsToBeSignedOff
} = useUser()
const userStore = useUser()
const { canSetAllocations, canSignoff } = storeToRefs(userStore)

const signoffs = ref([])
const poasToSignoff = ref([])
const somsToSignoff = ref([])

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
    type: 'range',
    key: '_nr_reviews',
    name: t('pages.notifications.nr_reviews'),
    default: [0, 0]
  },
  {
    type: 'range',
    key: '_nr_approvals',
    name: t('pages.notifications.nr_approvals'),
    default: [0, 0]
  },
  {
    type: 'date',
    key: '_from',
    name: t('pages.notifications.from'),
    default: '1970-01-01T00:00:00.000Z'
  },
])

const notificationsCount = computed(() => {
  return (
    signoffs.value.length + 
    poasToSignoff.value.length
  )
})

const handlePoasToSignoffFilters = async (params) => {
  if (canSetAllocations.value || canSignoff.value) {
    poasToSignoff.value = await getPoasToBeSignedOff(
      params._from, 
      params._nr_reviews || toSignoffFilters.value[0].default,
      params._nr_approvals || toSignoffFilters.value[1].default
    )
  }
}

const handleSomsToSignoffFilters = async (params) => {
  if (canSetAllocations.value || canSignoff.value) {
    somsToSignoff.value = await getSomsToBeSignedOff(
      params._from, 
      params._nr_reviews || toSignoffFilters.value[0].default,
      params._nr_approvals || toSignoffFilters.value[1].default
    )
  }
}

onMounted(async () => {
  if (canSetAllocations.value || canSignoff.value) {
    poasToSignoff.value = await getPoasToBeSignedOff(
      toSignoffFilters.value[2].default,
      toSignoffFilters.value[0].default,
      toSignoffFilters.value[1].default
    )
    somsToSignoff.value = await getSomsToBeSignedOff(
      toSignoffFilters.value[2].default,
      toSignoffFilters.value[0].default,
      toSignoffFilters.value[1].default
    )
  }
})

</script>

<script>
import NotificationList from '@/components/notifications/NotificationList.vue'
import ToBeSignedOffRow from '@/components/notifications/ToBeSignedOffRow.vue'
</script>
