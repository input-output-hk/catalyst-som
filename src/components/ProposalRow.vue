<template>
  <tr>
    <td>{{item.project_id}}</td>
    <td>
      <router-link :to="{name: 'proposal', params: {id: item.project_id}}">
        {{item.title}}
      </router-link>
    </td>
    <td>{{ item.challenges.title }}</td>
    <td class="has-text-right">{{ $n(item.budget, "currency") }}</td>
  </tr>
</template>

<script setup>
import { ref, onMounted } from 'vue'
const props = defineProps(['item'])

const v = ref(false)

</script>

<script>
import { computed } from 'vue'

export default {
  computed: {
  }
}
</script>

<style lang="scss">
  .checkbox-col label .control-label {
    display: none !important;
  }
</style>
