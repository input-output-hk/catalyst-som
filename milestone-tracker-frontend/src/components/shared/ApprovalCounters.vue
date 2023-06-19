<template>
  <div class="tile is-ancestor mb-0">
    <div class="tile is-6 is-parent">
      <div :class="{'is-success': approved, 'is-info': !approved }" class="tile is-child notification">
        <h4 class="is-size-3 mr-4 has-text-weight-semibold mb-0">{{ approves }}</h4>{{ $t('reviews_counter.approvals', approves) }}<br />
      </div>
    </div>
    <div class="tile is-6 is-parent">
      <div :class="{'is-info': approved, 'is-danger': !approved}" class="tile is-child notification">
        <h4 :class="{'has-text-white': !approved}" class="is-size-3 mr-4 has-text-weight-semibold mb-0 ">{{ notApproves }}</h4>{{ $t('reviews_counter.refusals', notApproves) }}<br />
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  approved: {
    type: Boolean,
    default: false
  },
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

<style lang="scss" scoped>
  .is-success {
    h4 {
      color: #fff;
    }
  }
</style>
