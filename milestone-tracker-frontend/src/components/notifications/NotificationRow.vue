<template>
  <tr>
    <td>
      <router-link :to="{name: 'proposal-milestones-detail-section', params: {id: item.project_id, milestone: item.milestone, section: targetSection}}">
        {{ item.project_id }}
      </router-link>
    </td>
    <td>
      <router-link :to="{name: 'proposal-milestones-detail-section', params: {id: item.project_id, milestone: item.milestone, section: targetSection}}">
        {{ item.title }}
      </router-link>
    </td>
    <td>{{ item.milestone }}</td>
    <td>{{$d(item.created_at, 'long')}}</td>
    <td>
      <span v-if="isReview">
        <span v-if="(approved)" class="tag is-success">{{ $t('pages.notifications.approved') }}</span>
        <span v-else class="tag is-danger">{{ $t('pages.notifications.not_approved') }}</span>
        <br />
      </span>
      <router-link :to="{name: 'proposal-milestones-detail-section', params: {id: item.project_id, milestone: item.milestone, section: targetSection}}">
        {{ _msg }}
      </router-link>
    </td>
  </tr>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  item: {
    type: Object,
    default: () => {}
  },
  msg: {
    type: String,
    default: 'Go to'
  },
  entityType: {
    type: String,
    default: 'som'
  }
})

const approved = computed(() => {
  const item = props.item
  return  (item.content_approved || (item.outputs_approved && item.success_criteria_approved && item.evidence_approved))
})

const isReview = computed(() => {
  const keys = Object.keys(props.item)
  return (keys.includes('content_approved') || keys.includes('outputs_approved'))
})

const _msg = computed(() => {
  if (isReview.value) {
    if (!approved.value) {
      return (props.entityType === 'som') ? t('pages.notifications.open_som_to_resubmit') : t('pages.notifications.open_poa_to_resubmit')
    }
  }
  return props.msg
})

const targetSection = computed(() => {
  return `${props.entityType}-${props.item.milestone}`
})

</script>
