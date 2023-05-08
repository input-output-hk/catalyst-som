<template>
  <div class="block new-signoff-popup">
    <div class="card">
      <header class="card-header">
        <p class="card-header-title">
          {{ $t('milestone.resubmission_title') }}
        </p>
      </header>
      <div class="card-content">
        <p>
          {{ $t('milestone.resubmission_msg') }}
        </p>
        <div class="buttons">
          <o-button
            variant="primary"
            size="medium"
            @click="emit('confirm')">
            {{ $t('milestone.resubmission_confirm') }}
          </o-button>
          <o-button
            size="medium"
            @click="emit('clearConfirm')">
            {{ $t('milestone.resubmission_clear') }}
          </o-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>

const emit = defineEmits(['clearConfirm', 'confirm'])

</script>