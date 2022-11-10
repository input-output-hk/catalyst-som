<template>
  <div class="table-container" :class="classStyle">
    <table class="table is-bordered is-striped">
      <thead>
        <tr>
          <th v-for="header in headers">{{header}}</th>
        </tr>
      </thead>
      <tbody>
        <component :is="itemComponent" v-for="item in items" :item="item" />
      </tbody>
    </table>
  </div>
  <o-pagination
    :total="count"
    v-model:current="page"
    :per-page="size"
    aria-next-label="Next page"
    aria-previous-label="Previous page"
    aria-page-label="Page"
    aria-current-label="Current page"
  >
  </o-pagination>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'

const props = defineProps({
  headers: Array,
  items: Object,
  size: {
    type: Number,
    default: 25
  },
  getItems: Function,
  getCount: Function,
  itemComponent: Object,
  classStyle: String
})

const page = ref(1)
const count = ref(0)

const _getItems = () => {
  props.getItems(page.value - 1, props.size)
}

watch(page, (val) => {
  _getItems()
})

onMounted(async () => {
  count.value = await props.getCount()
  _getItems()
})


</script>
