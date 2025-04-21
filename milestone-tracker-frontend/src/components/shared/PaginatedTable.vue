<template>
  <div class="table-container" :class="classStyle">
    <table class="table is-bordered is-striped is-fullwidth">
      <thead>
        <tr>
          <th v-for="header in headers" :key="header">{{header}}</th>
        </tr>
      </thead>
      <tbody>
        <component :is="itemComponent" v-for="item, idx in items" :key="`row-${idx}`" :item="item" />
      </tbody>
    </table>
  </div>
  <o-pagination
    v-model:current="page"
    :total="count"
    :per-page="size"
    :aria-next-label="$t('table.next')"
    :aria-previous-label="$t('table.previous')"
    :aria-page-label="$t('table.page')"
    :aria-current-label="$t('table.current')"
  >
  </o-pagination>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'

const props = defineProps({
  headers: {
    type: Array,
    default: () => []
  },
  items: {
    type: Object,
    default: () => {}
  },
  size: {
    type: Number,
    default: 25
  },
  getItems: {
    type: Function,
    default: () => []
  },
  getCount: {
    type: Function,
    default: () => 0
  },
  itemComponent: {
    type: Object,
    default: () => {}
  },
  classStyle: {
    type: String,
    default: ''
  }
})

const page = ref(1)
const count = ref(0)

const _getItems = () => {
  props.getItems(page.value - 1, props.size)
}

watch(page, () => {
  _getItems()
})

onMounted(async () => {
  count.value = await props.getCount()
  _getItems()
})

</script>

<style lang="scss">
.table-container {
  overflow: initial;
  overflow-y: initial;
}
</style>
