<template>
  <div class="tile is-ancestor mb-0 mt-4" v-if="payment">
    <div class="tile is-6 is-parent">
      <div class="tile is-child notification is-info">
        <h4 class="is-size-3 mr-4 has-text-weight-semibold mb-0">
          {{ $n(totPayment, "currency") }}
        </h4><p>{{ $t('next_payment.to_be_distributed') }}</p>
        <p>
          <strong>{{ $n(payment.poaPayment, "currency") }}</strong>
          {{ $t('next_payment.as_poa_completion') }}
        </p>
        <p>
          <strong>{{ $n(payment.chunkPayment, "currency") }}</strong>
          {{ $t('next_payment.as_monthly_chunk') }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps(['payment'])

const totPayment = computed(() => {
  if (props.payment) {
    return props.payment.poaPayment + props.payment.chunkPayment
  }
  return 0
})

</script>
