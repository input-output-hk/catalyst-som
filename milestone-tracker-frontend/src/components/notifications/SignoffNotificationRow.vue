<template>
  <tr>
    <td>
      <router-link :to="{name: 'proposal-milestones-detail-section', params: {id: item.project_id, milestone: milestone, section: targetSection}}">
        {{ item.title }}
      </router-link>
    </td>
    <td>{{ milestone }}</td>
    <td>{{$d(item.created_at, 'long')}}</td>
    <td>
      <router-link :to="{name: 'proposal-milestones-detail-section', params: {id: item.project_id, milestone: milestone, section: targetSection}}">
        {{ msg }}
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
  }
})

const entityType = computed(() => {
  return (props.item.poa_id) ? 'poa' : 'som'
})

const msg = computed(() => {
  return t(`pages.notifications.go_to_${entityType.value}`)
})

const milestone = computed(() => {
  return (entityType.value === 'som') ? props.item.milestone : props.item.poa_milestone
})

const targetSection = computed(() => {
  return `${entityType.value}-${milestone.value}`
})
</script>
