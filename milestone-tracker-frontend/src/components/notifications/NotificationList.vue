<template>
  <div class="content">
    <h2>{{title}}</h2>
    <div v-if="filters.length > 0" class="field is-horizontal">
      <o-field v-for="f in filters" :key="f.key" :label="f.name" class="mr-4">
        <o-input
          v-if="f.type !== 'date'"
          v-model="_filter[f.key]"
          :type="f.type"
          :placeholder="f.name"
        />
        <o-datepicker
          v-if="f.type === 'date'"
          v-model="_filter[f.key]"
          :show-week-number="false"
          :placeholder="f.name"
          icon="calendar"
          trap-focus
        >
        </o-datepicker>
      </o-field>
      <o-field class="mb-3 is-flex is-align-items-flex-end">
        <o-button variant="primary" @click="_handleFilter">{{ $t('pages.notifications.filter') }}</o-button>
      </o-field>
    </div>
    <div v-if="filters.length > 0 && items.length === 0">
      <div class="tile is-ml is-parent">
        <div class="tile is-child notification is-info">
          <p>{{ $t('pages.notifications.no_filter_results') }}</p>
        </div>
      </div>
    </div>
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
          :entity-type="entityType"
          />
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const _filter = ref({})

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
  },
  entityType: {
    type: String,
    default: 'som'
  },
  filters: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['applyFilter'])

const _handleFilter = () => {
  emit('applyFilter', _filter.value)
}
</script>