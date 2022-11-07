<template>
  <div class="content">
    <h3 class="subtitle">Proof of Achivement</h3>
    <poa
      :current="true"
      :poa="currentPoa"
      :som="som"
      :proposal="proposal" />
    <o-button
      class="mt-6"
      size="medium"
      v-if="otherPoas.length > 0"
      @click="othersVisible = !othersVisible">
      {{(othersVisible) ? 'Hide archived PoAs' : 'Show archived PoAs'}}
    </o-button>
    <section class="section pr-0 pl-0" v-if="othersVisible">
      <h3 class="subtitle">Archived Proof of Achivement</h3>
      <poa
        :current="false"
        :poa="poa"
        :som="som"
        :proposal="proposal"
        v-for="poa in otherPoas" />
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
const props = defineProps(['poas', 'proposal', 'som'])

const othersVisible = ref(false)

const otherPoas = computed(() => {
  if (props.poas) {
    const [, ...rest] = props.poas
    return rest
  }
  return []
})

const currentPoa = computed(() => {
  if (props.poas) {
    return (props.poas.length > 0) ? props.poas[0] : false
  }
  return false
})

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
