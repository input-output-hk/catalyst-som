<template>
  <tr>
    <td>{{ item.title }}</td>
    <td>{{ item.milestone }}</td>
    <td>{{$d(item.created_at, 'long')}}</td>
    <td>
      <span v-if="isReview">
        <span class="tag is-success" v-if="(approved)">{{ $t('pages.notifications.approved') }}</span>
        <span class="tag is-danger" v-else>{{ $t('pages.notifications.not_approved') }}</span>
        <br />
      </span>
      <router-link :to="{name: 'proposal-milestones-detail', params: {id: item.project_id, milestone: item.milestone}}">
        {{ msg }}
      </router-link>
    </td>
  </tr>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({
  item: {
    type: Object,
    default: () => {}
  },
  msg: {
    type: String,
    default: 'Go to'
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

</script>
