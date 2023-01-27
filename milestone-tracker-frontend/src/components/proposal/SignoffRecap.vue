<template>
  <div class="tile is-ancestor mb-0" v-if="signoffs.length > 0">
    <div class="tile is-12 is-parent">
      <div class="tile is-child notification is-success">
        <strong>{{ $t('signoff.poa_signed_off_at') }}</strong> {{ $d(signoffs[0].created_at, 'long') }}
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  signoffs: {
    type: Array,
    default: () => []
  }
})
</script>
