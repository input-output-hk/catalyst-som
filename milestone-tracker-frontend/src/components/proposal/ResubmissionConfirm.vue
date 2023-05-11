<template>
  <div class="block som-resubmission-popup">
    <div class="card">
      <header class="card-header">
        <p class="card-header-title">
          {{ title }}
        </p>
      </header>
      <div class="card-content">
        <p>
          {{ msg }}
        </p>
        <div class="buttons">
          <o-button
            variant="primary"
            size="medium"
            @click="emit('confirm')">
            {{ confirmMsg }}
          </o-button>
          <o-button
            size="medium"
            @click="emit('clearConfirm')">
            {{ clearMsg }}
          </o-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: ''
  },
  msg: {
    type: String,
    default: ''
  },
  confirmMsg: {
    type: String,
    default: ''
  },
  clearMsg: {
    type: String,
    default: ''
  }
})
const emit = defineEmits(['clearConfirm', 'confirm'])

</script>