<template>
  <div class="columns is-ancestor mb-0">
    <div class="is-6 column is-parent">
      <div :class="{'is-success': approved, 'is-info has-text-black': !approved }" class="is-child notification">
        <h4 class="is-size-3 mr-4 has-text-weight-semibold mb-0">{{ approves }}</h4>
        <p>
          {{ $t('reviews_counter.approvals', approves) }}
          <br />
        </p>
      </div>
    </div>
    <div class="column is-6 is-parent">
      <div :class="{'is-info has-text-black': approved, 'is-danger': !approved}" class="is-child notification ">
        <h4 :class="{'has-text-white': !approved}" class="is-size-3 mr-4 has-text-weight-semibold mb-0 ">{{ notApproves }}</h4>
        <p>
          {{ $t('reviews_counter.refusals', notApproves) }}<br />
        </p>
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
    h4, p {
      color: #fff;
    }
  }
</style>
