<template>
  <tr>
    <td>{{ item.title }}</td>
    <td>{{ item.milestone }}</td>
    <td>{{$d(item.created_at, 'long')}}</td>
    <td>
      <router-link :to="{name: 'proposal-milestones-detail', params: {id: item.project_id, milestone: item.milestone}}">
        {{ msg }}
      </router-link>
    </td>
  </tr>
</template>

<script setup>
defineProps({
  item: {
    type: Object,
    default: () => {}
  },
  msg: {
    type: String,
    default: 'Go to'
  }
})
</script>
