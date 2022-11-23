<template>
  <div class="tile is-ancestor is-flex-wrap-wrap is-justify-content-flex-start">
    <milestone-recap :proposal="proposal" :milestone="ml + 1" v-for="ml in [...Array(5).keys()]" />
  </div>
</template>

<script setup>
import MilestoneRecap from '@/components/proposal/MilestoneRecap.vue'
const props = defineProps(['proposal'])
</script>
