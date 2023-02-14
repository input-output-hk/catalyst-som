<template>
  <div class="tile is-ancestor is-flex-wrap-wrap is-justify-content-flex-start">
    <milestone-recap v-for="ml in durations" :key="ml.id" :proposal="proposal" :milestone="ml" />
  </div>
</template>

<script setup>
import MilestoneRecap from '@/components/proposal/MilestoneRecap.vue'
defineProps({
  proposal: {
    type: Object,
    default: () => {}
  },
  durations: {
    type: Array,
    default: () => []
  }
})
</script>
