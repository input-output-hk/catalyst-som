<template>
  <div v-if="signoffs.length > 0" class="mb-0">
    <div class="is-12 is-parent">
      <div class="is-child notification is-success has-text-white">
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
