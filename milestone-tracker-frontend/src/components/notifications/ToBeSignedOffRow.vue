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
    <td>{{ item.nr_reviews}}</td>
    <td>{{ item.nr_approvals}}</td>
    <td>
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
    default: ''
  },
  entityType: {
    type: String,
    default: 'som'
  }
})

const _msg = computed(() => {
  if (props.msg !== '') {
    return props.msg
  }
  return (props.entityType === 'som') ? t('pages.notifications.open_som_to_signoff') : t('pages.notifications.open_poa_to_signoff')
})

const targetSection = computed(() => {
  return `${props.entityType}-${props.item.milestone}`
})

</script>
