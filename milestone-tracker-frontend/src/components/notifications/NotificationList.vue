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
        <component
          :is="rowComponent"
          v-for="item in items"
          :key="item.id"
          :item="item"
          :msg="rowMsg"
          />
      </tbody>
    </table>
  </div>
</template>

<script setup>

defineProps({
  title: {
    type: String,
    default: 'Notifications'
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
  },
  rowComponent: {
    type: Object,
    default: () => {}
  }
})
</script>
