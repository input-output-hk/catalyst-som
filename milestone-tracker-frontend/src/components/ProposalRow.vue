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
const props = defineProps(['item'])
</script>

<style lang="scss">
  .checkbox-col label .control-label {
    display: none !important;
  }
</style>
