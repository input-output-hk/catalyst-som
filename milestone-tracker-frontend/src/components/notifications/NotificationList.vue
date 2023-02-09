<template>
  <div class="content">
    <h2>{{title}}</h2>
    <table v-if="items.length > 0" class="table is-bordered is-striped">
      <thead>
        <tr>
          <th v-for="header in headers" :key="header">{{header}}</th>
        </tr>
      </thead>
      <tbody>
        <notification-row
          v-for="item in items"
          :key="item.id"
          :item="item"
          :msg="rowMsg"
          />
      </tbody>
    </table>
    <p v-if="!items.length">{{ noItemsMsg }}</p>
  </div>
</template>

<script setup>
import NotificationRow from '@/components/notifications/NotificationRow.vue'

defineProps({
  title: {
    type: String,
    default: 'Notifications'
  },
  noItemsMsg: {
    type: String,
    default: 'No items'
  },
  rowMsg: {
    type: String,
    default: 'Go to'
  },
  headers: {
    type: Array,
    default: () => []
  },
  items: {
    type: Object,
    default: () => {}
  }
})
</script>
