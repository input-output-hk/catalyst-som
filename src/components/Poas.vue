<template>
  <div class="content">
    <h4>Proof of Achivements</h4>
    <poa
      :poa="poa"
      :proposal="proposal"
      v-for="poa in poas" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
const props = defineProps(['poas', 'proposal'])

</script>

<script>
import { computed } from 'vue'
import { mapState } from 'pinia'
import Poa from '../components/Poa.vue'

export default {
  components: {
    Poa,
  },
  computed: {
  }
}
</script>
