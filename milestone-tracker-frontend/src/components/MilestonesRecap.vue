<template>
  <div class="tile is-ancestor is-flex-wrap-wrap is-justify-content-flex-start">
    <milestone-recap :proposal="proposal" :milestone="ml" v-for="ml in durations" />
  </div>
</template>

<script setup>
import MilestoneRecap from '@/components/proposal/MilestoneRecap.vue'
const props = defineProps(['proposal', 'durations'])
</script>
