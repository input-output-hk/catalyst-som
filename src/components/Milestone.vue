<template>
  <div class="content">
    <h2>Statement of Milestone {{milestone}}</h2>
    <som
      :milestone="milestone"
      :som="currentSom"
      :proposal="proposal"
      :current="true" />
    <o-button
      v-if="otherSoms.length > 0"
      @click="othersVisible = !othersVisible">
      {{(othersVisible) ? 'Hide old SoMs' : 'Show old SoMs'}}
    </o-button>
    <section class="section" v-if="othersVisible">
      <h3 class="subtitle">Old Statements of Milestone</h3>
      <som
        :current="false"
        :som="som"
        :proposal="proposal"
        v-for="som in otherSoms" />
    </section>
    <o-button
      v-if="canWriteSom(proposal.id)"
      @click="newVisible = !newVisible">
      {{(newVisible) ? 'Hide submit new SoMs' : 'Submit new SoM'}}
    </o-button>
    <section class="section" v-if="newVisible">
      <new-som :proposal="proposal" :milestone="props.milestone" />
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useSoms } from '../store/soms.js'
const { getSoms, proposals } = useSoms()
import { useUser } from '../store/user.js'
const { canWriteSom } = useUser()
const props = defineProps(['proposal', 'milestone'])
import { computedAsync } from '@vueuse/core'
import useEventsBus from '../eventBus'
const { bus } = useEventsBus()

const othersVisible = ref(false)
const newVisible = ref(false)

const soms = computed(() => {
  try {
    return proposals[props.proposal.id][props.milestone]
  } catch {
    return []
  }
})

const otherSoms = computed(() => {
  if (soms.value) {
    const [, ...rest] = soms.value
    return rest
  }
  return []
})

const currentSom = computed(() => {
  if (soms.value) {
    return (soms.value.length > 0) ? soms.value[0] : false
  }
  return false
})

watch(()=>bus.value.get('getSomsBus'), (val) => {
  // destruct the parameters
  const [getSomsBus] = val ?? []
  getSomsBus.value = getSomsBus
  if (
    (getSomsBus.value.proposal_id === props.proposal.id) &&
    (getSomsBus.value.milestone === props.milestone)
  ) {
    getSoms(props.proposal.id, props.milestone)
  }
})

watch(props, () => getSoms(props.proposal.id, props.milestone))

</script>

<script>
import Som from '../components/Som.vue'
import NewSom from '../components/NewSom.vue'

export default {
  components: {
    Som,
    NewSom
  }
}
</script>
