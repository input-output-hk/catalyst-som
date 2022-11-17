<template>
  <div class="content">
    <div class="box">
      <h3>
        <router-link :to="{name: 'proposal', params: {id: proposal.project_id}}">
          {{proposal.project_id}}
        </router-link>
      </h3>
      <h1>{{proposal.title}}</h1>
    </div>
  </div>
</template>

<script setup>
const props = defineProps(['proposal'])
</script>
