<template>
  <div class="content">
    <div class="box">
      <h3>SoMs</h3>
      <som
        :som="som"
        v-for="som in soms" />
      <new-som :proposal="proposal" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useSoms } from '../store/soms.js'
const { getSoms } = useSoms()
const props = defineProps(['proposal'])
import { computedAsync } from '@vueuse/core'

const soms2 = computedAsync(
  async () => {
    if (props.proposal.id) {
      return await getSoms(props.proposal.id)
    }
    return []
  },
  []
)
</script>

<script>
import { computed } from 'vue'
import { mapState } from 'pinia'
import Som from '../components/Som.vue'
import NewSom from '../components/NewSom.vue'

export default {
  components: {
    Som,
    NewSom
  },
  computed: {
    ...mapState(useSoms, {
      soms: 'soms'
    }),
  }
}
</script>
