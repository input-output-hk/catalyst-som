<template>
  <div :class="`${entity}-resubmission-popup`" class="block">
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
  },
  entity: {
    type: String,
    default: 'som'
  }
})
const emit = defineEmits(['clearConfirm', 'confirm'])

</script>