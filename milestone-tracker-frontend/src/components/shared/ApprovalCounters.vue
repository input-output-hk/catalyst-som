<template>
  <div class="tile is-ancestor mb-0">
    <div class="tile is-6 is-parent">
      <div class="tile is-child notification is-info">
        <h4 class="is-size-3 mr-4 has-text-weight-semibold mb-0">{{ approves }}</h4>{{ $t('reviews_counter.approvals', approves) }}<br />
      </div>
    </div>
    <div class="tile is-6 is-parent">
      <div class="tile is-child notification is-danger">
        <h4 class="is-size-3 mr-4 has-text-weight-semibold mb-0 has-text-white">{{ notApproves }}</h4>{{ $t('reviews_counter.refusals', notApproves) }}<br />
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  approves: {
    type: Number,
    default: 0
  },
  notApproves: {
    type: Number,
    default: 0
  }
})
</script>
