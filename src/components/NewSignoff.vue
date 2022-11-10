<template>
  <div class="block">
    <div class="card">
      <header class="card-header">
        <p class="card-header-title">
          Signoff
        </p>
      </header>
      <div class="card-content">
        <p>Confirm Signoff? This SoM will be locked.</p>
        <div class="buttons">
          <o-button
            variant="primary"
            size="medium"
            @click="signoff">
            Signoff
          </o-button>
          <o-button
            size="medium"
            @click="emit('clearSignoff')">
            Cancel
          </o-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
const props = defineProps(['som', 'poa'])
const emit = defineEmits(['clearSignoff'])
import { useSignoffs } from '../store/signoffs.js'
const { createSignoff } = useSignoffs()


const signoff = async () => {
  let data
  if (props.poa) {
    data = { poa_id: props.poa.id }
  } else if (props.som) {
    data = { som_id: props.som.id }
  }
  const response = await createSignoff(data, props.som)
  if (response) {
    emit('clearSignoff')
  }
}
</script>

<script>
import { computed } from 'vue'

export default {
  computed: {
  }
}
</script>
